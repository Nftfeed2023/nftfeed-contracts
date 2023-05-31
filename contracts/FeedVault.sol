// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "./interfaces/IPancakeRouter.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakePair.sol";

import "./common/TokenERC721.sol";
import "./FeedToken.sol";

contract FeedVault is Ownable, ReentrancyGuard, ERC721Holder {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeERC20 for IERC20;

    uint256 public constant DIVISOR_ERC20 = uint256(10) ** 18;

    string public name;

    uint256 public vaultIndex = 0;
    address public feedToken;
    address public stableToken;
    address public dexRouter;
    address public dexFactory;

    event NotiAmount(uint256 amountStableToken, uint256 amountFeedToken);
    event NotiAmountLP(uint256 amountLps);

    struct VaultInfo {
        string name;
        address manager;
        address nft;
        uint256 priceNft;
        uint256 totalMint;
        uint256 totalLP;
        uint256 minQtyMintAllowedToSell;
    }

    // vaultId =>  VaultInfo
    mapping(uint256 => VaultInfo) public containerVault;
    // address NFT => vaultId
    mapping(address => uint256) public vaultIdToNftAddress;

    constructor(address _stableToken, address _dexRouter, address _dexFactory) {
        name = "FEED VAULT FACTORY";
        FeedToken feedTokenCt = new FeedToken();
        feedToken = address(feedTokenCt);
        stableToken = _stableToken;
        dexRouter = _dexRouter;
        dexFactory = _dexFactory;
    }

    function createVault(
        string memory _name,
        string memory _symbol,
        string memory _baseUrlNft,
        uint256 _priceNft, // price by stableToken
        uint256 _minQtyMintAllowedToSell
    ) external returns (uint256 vaultId) {
        require(
            _minQtyMintAllowedToSell >= 10,
            "Please setup min qty mint allowed to sell greater than 10"
        );
        // create NFT
        vaultIndex++;
        TokenERC721 nft = new TokenERC721(_name, _symbol, _baseUrlNft);
        vaultIdToNftAddress[address(nft)] = vaultIndex;
        containerVault[vaultIndex] = VaultInfo({
            name: _name,
            manager: address(msg.sender),
            nft: address(nft),
            priceNft: _priceNft,
            totalMint: 0,
            totalLP: 0,
            minQtyMintAllowedToSell: _minQtyMintAllowedToSell
        });
        return vaultIndex;
    }

    function mintNftByVault(
        uint256 _vaultId,
        uint256 _qty
    ) external returns (uint256[] memory tokenIds) {
        uint256 amountStableToken = _qty * containerVault[_vaultId].priceNft;
        IERC20(stableToken).safeTransferFrom(
            address(msg.sender),
            address(this),
            amountStableToken
        );
        address pair = IPancakeFactory(dexFactory).getPair(
            stableToken,
            feedToken
        );
        if (pair == address(0)) {
            return
                _mintNftByVault(
                    amountStableToken,
                    amountStableToken,
                    _vaultId,
                    _qty
                );
        }

        (uint256 reserveA, uint256 reserveB, ) = IPancakePair(pair)
            .getReserves();

        if (reserveA == 0 && reserveB == 0) {
            return
                _mintNftByVault(
                    amountStableToken,
                    amountStableToken,
                    _vaultId,
                    _qty
                );
        }
        uint256 amountFeedToken = IPancakeRouter(dexRouter).quote(
            amountStableToken,
            reserveA,
            reserveB
        );
        return
            _mintNftByVault(amountStableToken, amountFeedToken, _vaultId, _qty);
    }

    function _mintNftByVault(
        uint256 amountStableToken,
        uint256 amountFeedToken,
        uint256 vaultId,
        uint256 qty
    ) private returns (uint256[] memory tokenIds) {
        // tokenIds = new uint256[](qty);
        FeedToken(feedToken).mint(address(this), amountFeedToken);
        IERC20(stableToken).approve(dexRouter, amountStableToken);
        FeedToken(feedToken).approve(dexRouter, amountFeedToken);
        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        // add LP
        (, , uint256 lps) = IPancakeRouter(dexRouter).addLiquidity(
            stableToken,
            feedToken,
            amountStableToken,
            amountFeedToken,
            0,
            0,
            address(this),
            deadline
        );
        // Mint NFT cho user
        tokenIds = TokenERC721(containerVault[vaultId].nft).mintBatch(
            address(msg.sender),
            qty
        );
        containerVault[vaultId].totalMint += qty;
        containerVault[vaultId].totalLP += lps;
        return tokenIds;
    }

    function getPair() public view returns (address pair) {
        return IPancakeFactory(dexFactory).getPair(stableToken, feedToken);
    }

    function getVaultInfoById(
        uint256 _vaultId
    ) public view returns (VaultInfo memory vaultInfo) {
        return containerVault[_vaultId];
    }

    function getVaultInfoByNft(
        address _nft
    ) public view returns (VaultInfo memory vaultInfo) {
        return containerVault[vaultIdToNftAddress[_nft]];
    }

    function getAmountLpOutByNft(
        uint256 _qtyIn,
        address _nft
    ) public view returns (uint256 amount) {
        if (_qtyIn == 0) {
            return 0;
        }
        if (vaultIdToNftAddress[_nft] == 0) {
            return 0;
        }
        uint256 balanceInVault = IERC721(_nft).balanceOf(address(this));
        VaultInfo memory vaultInfo = getVaultInfoByNft(_nft);
        uint256 totalQtyNftCaculate = vaultInfo.totalMint - balanceInVault;

        if (totalQtyNftCaculate <= 0) {
            return 0;
        }
        return (_qtyIn * vaultInfo.totalLP) / totalQtyNftCaculate;
    }

    function getAmountLpOutByVaulId(
        uint256 _qtyIn,
        uint256 _vaultId
    ) public view returns (uint256 amount) {
        return getAmountLpOutByNft(_qtyIn, containerVault[_vaultId].nft);
    }

    function getAmountOutByVaulId(
        uint256 _qtyIn,
        uint256 _vaultId
    ) public view returns (uint256 amountStableToken, uint256 amountFeedToken) {
        uint256 amountLp = getAmountLpOutByVaulId(_qtyIn, _vaultId);
        (uint256 reserveA, uint256 reserveB, ) = IPancakePair(getPair())
            .getReserves();
        uint256 totalSupplyLP = IPancakePair(getPair()).totalSupply();
        return (
            (reserveA * amountLp) / totalSupplyLP,
            (reserveB * amountLp) / totalSupplyLP
        );
    }

    function getAmountOutByNft(
        uint256 _qtyIn,
        address _nft
    ) public view returns (uint256 amountStableToken, uint256 amountFeedToken) {
        uint256 amountLp = getAmountLpOutByNft(_qtyIn, _nft);
        (uint256 reserveA, uint256 reserveB, ) = IPancakePair(getPair())
            .getReserves();
        uint256 totalSupplyLP = IPancakePair(getPair()).totalSupply();
        return (
            (reserveA * amountLp) / totalSupplyLP,
            (reserveB * amountLp) / totalSupplyLP
        );
    }

    function viewListNftAddress() public view returns (address[] memory data) {
        data = new address[](vaultIndex);
        for (uint i = 0; i < vaultIndex; i++) {
            data[i] = containerVault[i + 1].nft;
        }
        return data;
    }

    function getVaultInfos() public view returns (VaultInfo[] memory data) {
        data = new VaultInfo[](vaultIndex);
        for (uint i = 0; i < vaultIndex; i++) {
            data[i] = containerVault[i + 1];
        }
        return data;
    }

    // BUY NFT và chọn NFT
    function targetRedeem(
        uint256 _vaultId,
        uint256[] calldata tokenIds
    ) external {
        require(_vaultId > 0 && _vaultId <= vaultIndex, "Vault not existed");
        require(tokenIds.length > 0, "List nft sellect empty");
        (
            uint256 amountStableToken,
            uint256 amountFeedToken
        ) = getAmountOutByVaulId(tokenIds.length, _vaultId);

        // tranfer USD user buy
        IERC20(stableToken).safeTransferFrom(
            address(msg.sender),
            address(this),
            amountStableToken
        );
        emit NotiAmount(amountStableToken, amountFeedToken);

        FeedToken(feedToken).mint(address(this), amountFeedToken);
        IERC20(stableToken).approve(dexRouter, amountStableToken);
        FeedToken(feedToken).approve(dexRouter, amountFeedToken);

        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        // add LP
        (, , uint256 lps) = IPancakeRouter(dexRouter).addLiquidity(
            stableToken,
            feedToken,
            amountStableToken,
            amountFeedToken,
            0,
            0,
            address(this),
            deadline
        );
        // gửi NFT cho user
        for (uint i = 0; i < tokenIds.length; i++) {
            TokenERC721(containerVault[_vaultId].nft).safeTransferFrom(
                address(this),
                address(msg.sender),
                tokenIds[i]
            );
        }
        containerVault[_vaultId].totalLP += lps;
    }

    function sellByVaultId(
        uint256 _vaultId,
        uint256[] calldata _tokenIds
    ) external returns (uint256 amountStableToken, uint256 amountFeedToken) {
        return _sellByVaultId(_vaultId, _tokenIds);
    }

    function sellByNftAddress(
        address _nft,
        uint256[] calldata _tokenIds
    ) external returns (uint256 amountStableToken, uint256 amountFeedToken) {
        return _sellByVaultId(vaultIdToNftAddress[_nft], _tokenIds);
    }

    // BUY NFT và chọn NFT
    function _sellByVaultId(
        uint256 vaultId,
        uint256[] calldata tokenIds
    ) private returns (uint256 amountStableToken, uint256 amountFeedToken) {
        require(vaultId > 0 && vaultId <= vaultIndex, "Vault not existed");
        require(tokenIds.length > 0, "List nft sellect empty");
        require(
            containerVault[vaultId].totalMint >=
                containerVault[vaultId].minQtyMintAllowedToSell,
            "The number of NFT mints is not enough to be able to buy and sell"
        );

        uint256 amountLps = getAmountLpOutByVaulId(tokenIds.length, vaultId);
        emit NotiAmountLP(amountLps);

        // cho phep router lấy LP
        uint256 maxUint256 = type(uint256).max;
        IPancakePair(getPair()).approve(dexRouter, maxUint256);

        // removeLP
        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        (amountStableToken, amountFeedToken) = IPancakeRouter(dexRouter)
            .removeLiquidity(
                stableToken,
                feedToken,
                amountLps,
                0,
                0,
                address(this),
                deadline
            );
        // cập nhật lại totalLp của vault
        containerVault[vaultId].totalLP -= amountLps;

        // tranfer NFT cua User vao vault
        for (uint i = 0; i < tokenIds.length; i++) {
            TokenERC721(containerVault[vaultId].nft).safeTransferFrom(
                address(msg.sender),
                address(this),
                tokenIds[i]
            );
        }
        // burn feedToken
        FeedToken(feedToken).burn(address(this), amountFeedToken);

        // gửi USD cho user
        IERC20(stableToken).safeTransfer(
            address(msg.sender),
            amountStableToken
        );

        emit NotiAmount(amountStableToken, amountFeedToken);
        return (amountStableToken, amountFeedToken);
    }
}

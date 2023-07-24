// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "./interfaces/IPancakeRouter.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakePair.sol";

import "./common/TokenERC721.sol";
import "./FeedToken.sol";

contract FeedVault is Ownable, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;
    uint256 public constant ONE_HUNDRED_PERCENT = 100 * 100; // 100%

    string public name;
    uint256 public vaultIndex = 0;
    address public feedToken;
    address public usdToken;
    address public dexRouter;
    address public dexFactory;

    address public treasureAddress; // địa chỉ pool nhận phí và khi rã NFT ra token
    address public devAddress; // địa chỉ dev
    address public daoAddress; // địa chỉ pool DAO
    address public mktAddress; // địa chỉ ví Marketting
    address public sharingAddress; // địa chỉ ví Pool để sharing cho add LP
    struct VaultInfo {
        string name;
        address manager;
        address nft;
        uint256 priceNft;
        uint256 totalMint;
        uint256 totalLP;
        uint256 minQtyMintAllowedToSell;
        uint256 warrantyExpirationDate; // ngày hết hạn bảo hành
        uint256 warrantyFee; //
        uint256 referalFee; // if =0 thì có nghĩa là không setup AFF mode
    }

    // vaultId =>  VaultInfo
    mapping(uint256 => VaultInfo) public containerVault;

    // vaultId => address (treasureAddress,devAddress,daoAddress,mktAddress)=> amount USD
    mapping(uint256 => mapping(address => uint256)) public systemAmountUsd;

    // vaultId => address (treasureAddress,devAddress,daoAddress,mktAddress)=> amount Feed
    mapping(uint256 => mapping(address => uint256)) public systemAmountFeed;

    // address NFT => vaultId
    mapping(address => uint256) public vaultIdToNftAddress;

    // vaultId => amount by USD
    mapping(uint256 => uint256) public projectFeeUsd;

    // vaultId => amount by FeedToken
    mapping(uint256 => uint256) public projectFeeFeed;

    // vaultId => address User ref => amount usd
    mapping(uint256 => mapping(address => uint256)) public amountReferal;

    constructor(
        address _usdToken,
        address _dexRouter,
        address _dexFactory,
        address _treasureAddress,
        address _devAddress,
        address _daoAddress,
        address _mktAddress,
        address _sharingAddress
    ) {
        name = "FEED VAULT FACTORY";
        require(_treasureAddress != address(0), "Fee address invalid");
        FeedToken feedTokenCt = new FeedToken();
        feedToken = address(feedTokenCt);
        usdToken = _usdToken;
        dexRouter = _dexRouter;
        dexFactory = _dexFactory;
        treasureAddress = _treasureAddress;
        devAddress = _devAddress;
        daoAddress = _daoAddress;
        mktAddress = _mktAddress;
        sharingAddress = _sharingAddress;
        IPancakeFactory(IPancakeRouter(dexRouter).factory()).createPair(
            usdToken,
            feedToken
        );
    }

    function createVault(
        string memory _name,
        string memory _symbol,
        string memory _baseUrlNft,
        uint256 _priceNft, // price by usdToken
        uint256 _minQtyMintAllowedToSell,
        uint256 _warrantyExpirationDate,
        uint256 _warrantyFee,
        uint256 _referalFee
    ) external returns (uint256 vaultId) {
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
            minQtyMintAllowedToSell: _minQtyMintAllowedToSell,
            warrantyExpirationDate: _warrantyExpirationDate,
            warrantyFee: _warrantyFee,
            referalFee: _referalFee
        });
        return vaultIndex;
    }

    function getPair() public view returns (address pair) {
        return IPancakeFactory(dexFactory).getPair(usdToken, feedToken);
    }

    function viewListNftAddress() public view returns (address[] memory data) {
        data = new address[](vaultIndex);
        for (uint i = 0; i < vaultIndex; i++) {
            data[i] = containerVault[i + 1].nft;
        }
        return data;
    }

    function getAmountLpOut(
        uint256 _vaultId,
        uint256 _qtyIn
    ) public view returns (uint256 amount) {
        if (_qtyIn == 0) {
            return 0;
        }
        if (vaultIdToNftAddress[containerVault[_vaultId].nft] == 0) {
            return 0;
        }
        uint256 balanceInVault = TokenERC721(containerVault[_vaultId].nft)
            .balanceOf(address(this));

        uint256 totalQtyNftCaculate = containerVault[_vaultId].totalMint -
            balanceInVault;

        if (totalQtyNftCaculate <= 0) {
            return 0;
        }
        return
            (_qtyIn * containerVault[_vaultId].totalLP) / totalQtyNftCaculate;
    }

    function _getAmountsOut(
        uint256 _amountIn,
        address _token0,
        address _token1
    ) private view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = _token0;
        path[1] = _token1;
        uint256[] memory amounts = IPancakeRouter(dexRouter).getAmountsOut(
            _amountIn,
            path
        );
        return amounts[amounts.length - 1];
    }

    function getAmountOut(
        uint256 _vaultId,
        uint256 _qtyIn
    ) public view returns (uint256 amountUsd, uint256 amountFeed) {
        uint256 amountLp = getAmountLpOut(_vaultId, _qtyIn);
        (uint256 reserveUsd, uint256 reserveFeed, ) = IPancakePair(getPair())
            .getReserves();
        uint256 totalSupplyLP = IPancakePair(getPair()).totalSupply();
        return (
            _getAmountsOut(
                (reserveFeed * amountLp) / totalSupplyLP,
                feedToken,
                usdToken
            ),
            _getAmountsOut(
                (reserveUsd * amountLp) / totalSupplyLP,
                usdToken,
                feedToken
            )
        );
    }

    function getAmountOutRatePair(
        uint256 _vaultId,
        uint256 _qtyIn
    ) public view returns (uint256 amountUsd, uint256 amountFeed) {
        uint256 amountLp = getAmountLpOut(_vaultId, _qtyIn);
        (uint256 reserveUsd, uint256 reserveFeed, ) = IPancakePair(getPair())
            .getReserves();
        uint256 totalSupplyLP = IPancakePair(getPair()).totalSupply();
        amountUsd = (reserveUsd * amountLp) / totalSupplyLP;
        amountFeed = (reserveFeed * amountLp) / totalSupplyLP;
        return (amountUsd, amountFeed);
    }

    function _mintNftByVault(
        uint256 _vaultId,
        uint256 _qty,
        uint256 _amountUsd,
        uint256 _amountFeed,
        address _referalAddress
    ) private returns (uint256[] memory tokenIds) {
        FeedToken(feedToken).mint(address(this), _amountFeed);
        IERC20(usdToken).approve(dexRouter, _amountUsd);
        FeedToken(feedToken).approve(dexRouter, _amountFeed);
        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        // add LP
        (, , uint256 lps) = IPancakeRouter(dexRouter).addLiquidity(
            usdToken,
            feedToken,
            _amountUsd,
            _amountFeed,
            0,
            0,
            address(this),
            deadline
        );
        // Mint NFT cho user
        tokenIds = TokenERC721(containerVault[_vaultId].nft).mintBatch(
            address(msg.sender),
            _qty
        );
        containerVault[_vaultId].totalMint += _qty;
        containerVault[_vaultId].totalLP += lps;
        if (
            containerVault[_vaultId].referalFee != 0 &&
            _referalAddress != address(0)
        ) {
            amountReferal[_vaultId][_referalAddress] +=
                (containerVault[_vaultId].priceNft *
                    containerVault[_vaultId].referalFee) /
                ONE_HUNDRED_PERCENT;

            // config cho từng dự án và không có refer cũng lấy %
            // 10 % cho dev
            systemAmountUsd[_vaultId][devAddress] +=
                (containerVault[_vaultId].priceNft * 10 * 100) /
                ONE_HUNDRED_PERCENT;

            // 10 % cho mkt
            systemAmountUsd[_vaultId][mktAddress] +=
                (containerVault[_vaultId].priceNft * 10 * 100) /
                ONE_HUNDRED_PERCENT;
        }
        return tokenIds;
    }

    function mintNftByVault(
        uint256 _vaultId,
        uint256 _qty,
        address _referalAddress
    ) external returns (uint256[] memory tokenIds) {
        uint256 amountUsd = _qty * containerVault[_vaultId].priceNft;
        IERC20(usdToken).safeTransferFrom(
            address(msg.sender),
            address(this),
            amountUsd
        );
        address pair = getPair();
        if (pair == address(0)) {
            return
                _mintNftByVault(
                    _vaultId,
                    _qty,
                    amountUsd,
                    amountUsd,
                    _referalAddress
                );
        }

        (uint256 reserveUsd, uint256 reserveFeed, ) = IPancakePair(pair)
            .getReserves();

        if (reserveUsd == 0 && reserveFeed == 0) {
            return
                _mintNftByVault(
                    _vaultId,
                    _qty,
                    amountUsd,
                    amountUsd,
                    _referalAddress
                );
        }
        uint256 amountFeed = IPancakeRouter(dexRouter).quote(
            amountUsd,
            reserveUsd,
            reserveFeed
        );
        return
            _mintNftByVault(
                _vaultId,
                _qty,
                amountUsd,
                amountFeed,
                _referalAddress
            );
    }

    function returnsGuaranteed(
        uint256 _vaultId,
        uint256[] calldata _tokenIds
    ) external returns (uint256 amountUsd, uint256 amountFeed) {
        if (containerVault[_vaultId].warrantyExpirationDate != 0) {
            require(
                containerVault[_vaultId].warrantyExpirationDate >
                    block.timestamp,
                "Vault Expiration Date"
            );
        }
        require(_vaultId > 0 && _vaultId <= vaultIndex, "Vault not existed");
        require(_tokenIds.length > 0, "List nft sellect empty");

        uint256 amountLps = getAmountLpOut(_vaultId, _tokenIds.length);

        // cho phep router lấy LP
        uint256 maxUint256 = type(uint256).max;
        IPancakePair(getPair()).approve(dexRouter, maxUint256);
        // removeLP
        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        (amountUsd, amountFeed) = IPancakeRouter(dexRouter).removeLiquidity(
            usdToken,
            feedToken,
            amountLps,
            0,
            0,
            address(this),
            deadline
        );
        // cập nhật lại totalLp của vault
        containerVault[_vaultId].totalLP -= amountLps;

        // tranfer NFT cua User vao vault
        for (uint i = 0; i < _tokenIds.length; i++) {
            TokenERC721(containerVault[_vaultId].nft).safeTransferFrom(
                address(msg.sender),
                address(this),
                _tokenIds[i]
            );
        }
        // burn feedToken
        FeedToken(feedToken).burn(address(this), amountFeed);

        // project setting fee  + 5% system
        uint256 totalWarrantyFee = containerVault[_vaultId].warrantyFee +
            450 + // 4.5% Treasure Pool
            50; // 0.5% Dev

        uint256 totalAmount = containerVault[_vaultId].priceNft *
            _tokenIds.length;

        totalAmount = amountUsd >= totalAmount ? totalAmount : amountUsd;

        // gửi USD cho user
        IERC20(usdToken).safeTransfer(
            address(msg.sender),
            (totalAmount * (ONE_HUNDRED_PERCENT - totalWarrantyFee)) /
                ONE_HUNDRED_PERCENT
        );

        // gửi vào ví DEV
        IERC20(usdToken).safeTransfer(
            address(devAddress),
            (totalAmount * 50) / ONE_HUNDRED_PERCENT
        );
        // gửi vào Treasure pool
        IERC20(usdToken).safeTransfer(
            address(treasureAddress),
            (totalAmount * 450) / ONE_HUNDRED_PERCENT
        );
        projectFeeUsd[_vaultId] +=
            (totalAmount * containerVault[_vaultId].warrantyFee) /
            ONE_HUNDRED_PERCENT;
        return (amountUsd, amountFeed);
    }

    // BUY NFT và chọn NFT
    function targetRedeem(
        uint256 _vaultId,
        uint256[] calldata _tokenIds
    ) external {
        // có thể cho dự án config
        // Chọn NFT random trong pool	4.00%
        // Chọn NFT trong pool	6.00%
        if (containerVault[_vaultId].warrantyExpirationDate != 0) {
            require(
                containerVault[_vaultId].warrantyExpirationDate >
                    block.timestamp,
                "Vault Expiration Date"
            );
        }
        require(_vaultId > 0 && _vaultId <= vaultIndex, "Vault not existed");
        require(_tokenIds.length > 0, "List nft sellect empty");
        (uint256 amountUsd, uint256 amountFeed) = getAmountOutRatePair(
            _vaultId,
            _tokenIds.length
        );

        // tranfer USD user buy có 6% phí gồm 1.2% project 1.2% Dev 2.4% cho DAO và 1.2% cho sharing add LP
        IERC20(usdToken).safeTransferFrom(
            address(msg.sender),
            address(this),
            amountUsd + (6 * 100 * amountUsd) / ONE_HUNDRED_PERCENT
        );
        // ghi nhận phần phí

        // 1.2% project
        projectFeeUsd[_vaultId] += (120 * amountUsd) / ONE_HUNDRED_PERCENT;

        // 1.2% Dev
        systemAmountUsd[_vaultId][devAddress] +=
            (120 * amountUsd) /
            ONE_HUNDRED_PERCENT;
        //  2.4% cho DAO
        systemAmountUsd[_vaultId][daoAddress] +=
            (240 * amountUsd) /
            ONE_HUNDRED_PERCENT;

        // 1.2% cho sharing add LP
        systemAmountUsd[_vaultId][sharingAddress] +=
            (120 * amountUsd) /
            ONE_HUNDRED_PERCENT;

        FeedToken(feedToken).mint(address(this), amountFeed);
        IERC20(usdToken).approve(dexRouter, amountUsd);
        FeedToken(feedToken).approve(dexRouter, amountFeed);

        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        // add LP
        (, , uint256 lps) = IPancakeRouter(dexRouter).addLiquidity(
            usdToken,
            feedToken,
            amountUsd,
            amountFeed,
            0,
            0,
            address(this),
            deadline
        );
        // gửi NFT cho user
        for (uint i = 0; i < _tokenIds.length; i++) {
            TokenERC721(containerVault[_vaultId].nft).safeTransferFrom(
                address(this),
                address(msg.sender),
                _tokenIds[i]
            );
        }
        containerVault[_vaultId].totalLP += lps;
    }

    // BUY NFT và chọn NFT
    function sellByVault(
        uint256 _vaultId,
        uint256[] calldata _tokenIds
    ) external returns (uint256 amountUsd, uint256 amountFeed) {
        // phí 5% bao gồm 2% project 1% dev 1% Dao và 1% sharing
        if (containerVault[_vaultId].warrantyExpirationDate != 0) {
            require(
                containerVault[_vaultId].warrantyExpirationDate >
                    block.timestamp,
                "Vault Expiration Date"
            );
        }

        require(_vaultId > 0 && _vaultId <= vaultIndex, "Vault not existed");
        require(_tokenIds.length > 0, "List nft sellect empty");
        require(
            containerVault[_vaultId].totalMint >=
                containerVault[_vaultId].minQtyMintAllowedToSell,
            "The number of NFT mints is not enough to be able to buy and sell"
        );

        // cho phep router lấy LP
        uint256 maxUint256 = type(uint256).max;
        IPancakePair(getPair()).approve(dexRouter, maxUint256);

        (uint256 calAmountUsd, ) = getAmountOut(_vaultId, _tokenIds.length);
        uint256 totalSupplyLP = IPancakePair(getPair()).totalSupply();

        (uint256 reserveUsd, , ) = IPancakePair(getPair()).getReserves();

        uint256 amountLps = (calAmountUsd * totalSupplyLP) / reserveUsd;

        // removeLP
        uint256 deadline = block.timestamp + 600; // 600 giây = 10 phút
        (amountUsd, amountFeed) = IPancakeRouter(dexRouter).removeLiquidity(
            usdToken,
            feedToken,
            amountLps,
            0,
            0,
            address(this),
            deadline
        );
        // cập nhật lại totalLp của vault
        containerVault[_vaultId].totalLP -= amountLps;

        // tranfer NFT cua User vao vault
        for (uint i = 0; i < _tokenIds.length; i++) {
            TokenERC721(containerVault[_vaultId].nft).safeTransferFrom(
                address(msg.sender),
                address(this),
                _tokenIds[i]
            );
        }

        // gửi feed token cho user
        IERC20(feedToken).safeTransfer(
            address(msg.sender),
            (amountFeed * 95 * 100) / ONE_HUNDRED_PERCENT
        );

        // ghi nhận phí
        // phí 5% bao gồm 2% project 1% dev 1% Dao và 1% sharing
        projectFeeFeed[_vaultId] += (amountFeed * 200) / ONE_HUNDRED_PERCENT;

        systemAmountFeed[_vaultId][devAddress] +=
            (amountFeed * 100) /
            ONE_HUNDRED_PERCENT;

        systemAmountFeed[_vaultId][daoAddress] +=
            (amountFeed * 100) /
            ONE_HUNDRED_PERCENT;
        systemAmountFeed[_vaultId][sharingAddress] +=
            (amountFeed * 100) /
            ONE_HUNDRED_PERCENT;

        // gửi USD vào vào ví dev và Treasure theo tỉ lệ 90% - 10%
        IERC20(usdToken).safeTransfer(
            address(treasureAddress),
            (amountUsd * 9) / 10
        );
        IERC20(usdToken).safeTransfer(
            address(devAddress),
            (amountUsd * 1) / 10
        );

        return (amountUsd, amountFeed);
    }

    // function withdrawUsdSystem(
    //     uint256 _vaultId,
    //     address _systemAddress
    // ) external onlyOwner {
    //     require(
    //         _systemAddress == treasureAddress ||
    //             _systemAddress == devAddress ||
    //             _systemAddress == daoAddress ||
    //             _systemAddress == mktAddress,
    //         "Address not existed system"
    //     );
    //     uint256 amount = systemAmountUsd[_vaultId][_systemAddress];
    //     IERC20(usdToken).safeTransfer(_systemAddress, amount);
    // }

    // function withdrawFeedSystem(
    //     uint256 _vaultId,
    //     address _systemAddress
    // ) external onlyOwner {
    //     require(
    //         _systemAddress == treasureAddress ||
    //             _systemAddress == devAddress ||
    //             _systemAddress == daoAddress ||
    //             _systemAddress == mktAddress,
    //         "Address not existed system"
    //     );
    //     uint256 amount = systemAmountFeed[_vaultId][_systemAddress];
    //     IERC20(feedToken).safeTransfer(_systemAddress, amount);
    // }
}

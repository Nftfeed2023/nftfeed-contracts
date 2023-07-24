now="$(date +'%Y-%m-%d %H:%M:%S')"
message="update $now";
git add . ;
git commit -m "$message";
git push;

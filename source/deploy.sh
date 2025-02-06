
TARGET="../"

#remove old files
rm -rf $TARGET"app/*"
rm  $TARGET"index.html"
rm  $TARGET"favicon.png"
cp -r build/* $TARGET.
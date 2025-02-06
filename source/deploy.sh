
TARGET="../"

#remove old files
rm -rf $TARGET"_app/*"
rm  $TARGET"index.html"
rm  $TARGET"favicon.png"
cp -r build/* $TARGET.
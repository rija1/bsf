#!/bin/zsh

# brew install coreutils
# The real GNU cp is required for cp -Rl

# Start

plugin="meow-gallery"
echo "Link with Meow Gallery Pro."

# Copy the files

dirs=(app classes common languages)
for x ($dirs); do
  rm -Rf $x
  /opt/homebrew/opt/coreutils/bin/gcp -Rl $PWD/../$plugin-pro/$x .
done

# Delete useless files

rm -Rf $PWD/app/*.map
rm -Rf $PWD/app/admin
rm -Rf $PWD/app/galleries
rm -Rf $PWD/app/less
rm -Rf $PWD/common/js

# Delete common only-PRO files
rm -Rf $PWD/common/premium

# Copy main files

rm $plugin.php
rm readme.txt
cp $PWD/../$plugin-pro/$plugin-pro.php ./$plugin.php
cp $PWD/../$plugin-pro/readme.txt ./readme.txt

# Modify main files

sed -i '' 's/ (Pro)//g' ./$plugin.php
sed -i '' 's/ (Pro)//g' ./readme.txt

echo "Done."

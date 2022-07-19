#!/bin/sh

version=$(npm view ./ version)
p=$(pwd)
echo "Updating version to $version"

cd dist/clr-angular && jq ".version=\"$version\"" package.json >package.json.tmp && cp package.json.tmp package.json && rm package.json.tmp
cd "$p" || exit 1
cd dist/clr-icons && jq ".version=\"$version\"" package.json >package.json.tmp && cp package.json.tmp package.json && rm package.json.tmp
cd "$p" || exit 1
cd dist/clr-ui && jq ".version=\"$version\"" package.json >package.json.tmp && cp package.json.tmp package.json && rm package.json.tmp
cd "$p" || exit 1

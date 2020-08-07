#!/usr/bin/env sh

# 确保脚本抛出遇到的错误

# 生成静态文件
npm run prod

# 进入生成的文件夹
cd dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:gyz418/gyz418.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:gyz418/blog.git master:gh-pages

cd -
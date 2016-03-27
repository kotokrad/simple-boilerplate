#!/bin/bash
user="kotokrad"

git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/"$user"/"${PWD##*/}".git
git push -u origin master
git subtree push --prefix dist origin gh-pages
#!/bin/bash
user="kotokrad"
repo="${PWD##*/}" #current folder name
https=false

if [[ "$https" = true ]]; then
	url="https://github.com/$user/$repo.git"
else
	url="git@github.com:$user/$repo.git"
fi

git init
printf "\ngit-deploy.sh\ngit-init.sh" >> .gitignore
git add .
git commit -m "initial commit"
git remote add origin "$url"
git push -u origin master
git subtree push --prefix dist origin gh-pages
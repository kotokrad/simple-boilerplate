#!/bin/bash
user="%default%"
repo="${PWD##*/}" #current folder name
https=false
gitignore=(
	"node_modules"
	"bower_components"
	)

if [[ "$user" = "%default%" ]] || [[ "$1" = "-changeuser" ]]; then
	read -p "GitHub username: " -e newuser
	if [ -n "$newuser" ]; then
		sed -i -e "0,/$user/ s/$user/$newuser/" "${0##*/}"
		user="$newuser"
	else
		echo "Not now? Okay.."
		exit
	fi
fi

sed -i -e "s/simple-boilerplate/$repo/" "package.json"
printf "%s\n" "${gitignore[@]}" > .gitignore

if [[ "$https" = true ]]; then
	url="https://github.com/$user/$repo.git"
else
	url="git@github.com:$user/$repo.git"
fi

curl -sS -u "$user" -d "{\"name\": \"$repo\"}" https://api.github.com/user/repos > /dev/null
git init
printf "\ngit-deploy.sh\ngit-init.sh" >> .gitignore
git add .
git commit -m "initial commit"
git remote add origin "$url"
git push -u origin master
git subtree push --prefix dist origin gh-pages

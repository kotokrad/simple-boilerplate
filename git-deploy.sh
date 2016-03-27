#!/bin/bash
user="kotokrad"

if [ -z "$1" ]; then
	files="."
else
	files="$@"
fi
read -p "Сommit message: " -e message
if [ -n "$message" ]; then
	git add "$files"
	git commit -m "$message"
	git push -u origin master
	git subtree push --prefix dist origin gh-pages
fi
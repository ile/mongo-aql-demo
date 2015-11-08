compile:
	webpack ./app.js bundle.js

run:
	python -m SimpleHTTPServer 8000

push:
	webpack ./app.js bundle.js
	git add -A .; git commit -am "..."; git push
	git checkout gh-pages
	git merge master
	git push origin gh-pages
	git checkout master

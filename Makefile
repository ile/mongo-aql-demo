run:
	webpack ./app.js bundle.js
	python -m SimpleHTTPServer 8000

compile:
	webpack ./app.js bundle.js

push:
	webpack ./app.js bundle.js
	git add -A .; git commit -am "..."; git push
	git checkout gh-pages
	git merge master
	git push origin gh-pages
	git checkout master

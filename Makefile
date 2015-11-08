compile:
	webpack ./app.js bundle.js
	python -m SimpleHTTPServer 8000

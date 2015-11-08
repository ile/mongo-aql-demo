/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var mongoaql = __webpack_require__(1),
		pane2 = document.getElementById('pane2'),
		editor = CodeMirror(document.getElementById('pane1'), {
			value: '{\n\t"foo": 123,\n\t"bar": 456\n}',
			mode:  "javascript"
		});

	function update(instance) {
		pane2.innerHTML = mongoaql('collection', instance.getValue());
	}

	update(editor);
	editor.on('change', update);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = parse;

	/*
	** Turn json object into AQL.
	*/
	function parse(collection, json) {
		var aql = 'FOR u IN ' + collection + ' ',
			filter = [],
			k, v, o, firstLetter;

		if (typeof json === 'string') {
			try {
				json = JSON.parse(json);
			}
			catch (err) {
				return err;
			}
		}

		if (!json) {
			return '';
		}

		for (k in json) {
			v = json[k];
			firstLetter = k.substring(0, 1);

			if (firstLetter == '$') {

			}
			else if (firstLetter == '@') {

			}
			else {
				o = {};
				o[k] = v;
				filter.push({ key: k, value: v });
			}
		}

		if (filter.length) {
			aql += '\n\tFILTER ';

			for (var i = 0; i < filter.length; i++) {
				if (i > 0) {
					aql += ' && ';
				}

				aql += filter[i].key + ' == ' + filter[i].value;
			}
		}

		aql += ' \nRETURN u';

		return aql;
	}

/***/ }
/******/ ]);
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
		collection = document.getElementById('collection'),
		editor = CodeMirror(document.getElementById('pane1'), {
			value: '{\n\t"foo": 123,\n\t"bar": "hello",\n\t"$limit": 3,\n\t"$orderby": { "bar": -1},\n\t"@city": "cities/123456789"\n}',
			mode:  "javascript"
		});

	function update() {
		var aql = mongoaql(collection.value, editor.getValue())

		if (aql) {
			pane2.value = aql.aql + '\n' + JSON.stringify(aql.vars) + '\n\n\ndb._query(\'' + aql.aql.replace(/[\n\t]/g, '') + '\', ' + JSON.stringify(aql.vars) + ')';
		}
	}

	update(editor);
	editor.on('change', update);
	collection.addEventListener('input', update);

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
			link = [],
			limit = 0,
			sort = null,
			values = {},
			k, v, cname, firstLetter, varname;

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
				if (k === '$limit') {
					limit = v;
				}
				else if (k === '$orderby') {
					for (k2 in v) {
						sort = { key: k2, how: v[k2] === 1? 'ASC': 'DESC' };
					}
				}
			}
			else if (firstLetter == '@') {
				try {
					link.push({ key: k.substring(1), value: v, collection: v.match(/^([^/]+)\//)[1] });
				}
				catch (err) {

				}
			}
			else {
				filter.push({ key: k, value: v });
			}
		}

		if (filter.length) {
			aql += '\n\tFILTER ';

			for (var i = 0; i < filter.length; i++) {
				if (i > 0) {
					aql += '&& ';
				}

				varname = 'v' + Object.keys(values).length;
				aql += 'u.' + filter[i].key + ' == @' + varname + ' ';
				values[varname] = filter[i].value;
			}
		}

		if (limit) {
			aql += '\n\tLIMIT ' + limit + ' ';
		}

		if (sort) {
			aql += '\n\tSORT u.' + sort.key + ' ' + sort.how + ' ';
		}

		if (link.length) {

			for (var i = 0; i < link.length; i++) {
				cname = 'c' + i;
				aql += '\n\t\tFOR ' + cname + ' IN ' + link[i].collection + ' ';
				aql += '\n\t\t\tFILTER u.' + link[i].key + ' == ' + cname + '._id ';
			}

			aql += 'RETURN merge(u';

			for (var i = 0; i < link.length; i++) {
				aql += ', { ' + link[i].key + ': ' + cname + ' }';
			}

			aql += ')';
		}
		else {
			aql += ' \nRETURN u';
		}

		return { aql: aql, vars: values };
	}

/***/ }
/******/ ]);
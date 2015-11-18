var mongoaql = require('mongo-aql'),
	result = document.getElementById('result'),
	errors = document.getElementById('errors'),
	collection = document.getElementById('collection'),
	q = {
		foo: { bar: 'baz', bar2: 'baz2' },
		"$limit": 10,
		"$skip": 100,
		"$orderby": { name: 1, name2: 1 },
		"@city": "cities"
	},
	editor = CodeMirror(document.getElementById('pane1'), {
		value: JSON.stringify(q, null, '\t'),
		mode:  "javascript"
	});

function update() {
	try {
		var aql = mongoaql(collection.value, editor.getValue())
		errors.innerHTML = '';

		if (aql) {
			result.value = aql.query + '\n' + JSON.stringify(aql.values) + '\n\n\ndb._query(\'' + aql.query.replace(/[\n\t]/g, '') + '\', ' + JSON.stringify(aql.values) + ')';
		}
	}
	catch (err) {
		errors.innerHTML = err;
	}
}

update(editor);
editor.on('change', update);
collection.addEventListener('input', update);
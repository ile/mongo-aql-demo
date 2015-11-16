var mongoaql = require('mongo-aql'),
	result = document.getElementById('result'),
	errors = document.getElementById('errors'),
	collection = document.getElementById('collection'),
	editor = CodeMirror(document.getElementById('pane1'), {
		value: '{\n\t"hi": "there",\n\t"foo": { "bar": "baz", "yo": "man" },\n\t"$limit": 10,\n\t"$skip": 100,\n\t"$orderby": { "hi": 1 },\n\t"@city": "cities"\n}',
		mode:  "javascript"
	});

function update() {
	try {
		var aql = mongoaql(collection.value, editor.getValue())
		errors.innerHTML = '';
		console.log(aql);

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
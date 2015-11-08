var mongoaql = require('mongo-aql'),
	pane2 = document.getElementById('pane2'),
	collection = document.getElementById('collection'),
	editor = CodeMirror(document.getElementById('pane1'), {
		value: '{\n\t"foo": 123,\n\t"bar": "hello",\n\t"$limit": 3,\n\t"$orderby": { "bar": 1 },\n\t"@city": "cities/123456789"\n}',
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
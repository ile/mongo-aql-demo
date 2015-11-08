var mongoaql = require('mongo-aql'),
	pane2 = document.getElementById('pane2'),
	collection = document.getElementById('collection'),
	editor = CodeMirror(document.getElementById('pane1'), {
		value: '{\n\t"foo": 123,\n\t"bar": "hello",\n\t"@city": "cities/123456789"\n}',
		mode:  "javascript"
	});

function update() {
	var aql = mongoaql(collection.value, editor.getValue())
	pane2.value = aql.aql + '\n' + JSON.stringify(aql.vars) + '\n\n\ndb._query(\'' + aql.aql.replace(/[\n\t]/g, '') + '\', ' + JSON.stringify(aql.vars) + ')';
}

update(editor);
editor.on('change', update);
collection.addEventListener('input', update);
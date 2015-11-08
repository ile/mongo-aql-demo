var mongoaql = require('mongo-aql'),
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
var view1, view2;
var start1, start2;
var viewCb = [];

function registerCallback ( name, cbFun ) {
	viewCb[name] = cbFun;
}

function triggerEvent ( name, type, data ) {
	switch ( type ) {
		case 'message':
			for (var view in viewCb)
				viewCb[view](type, data);
			break;
	}
}


$(function () {
    start1 = $('#start1');
    start2 = $('#start2');
	test = $('#test');

    start1.click(function () {
        view1 = window.open('view.html#view1', 'View 1', 'width=800,height=600,scrollbars=no,status=no,resizable=yes');
    });

    start2.click(function () {
        view2 = window.open('view.html#view2', 'View 2', 'width=800,height=600,scrollbars=no,status=no,resizable=yes');
    });
	
	test.click(function () {
		for(var view in viewCb) {
			console.log(view);
		}
	});
});
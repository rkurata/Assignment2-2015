$( "#logout").click.setTimeout(function() {
        	$.post('/viewschedule/new', json, function(){
				window.location.href = '/viewschedule';
			});
    	}, 3000);
	});
});
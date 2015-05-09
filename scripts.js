var main = function() {
	var activity;
	$('.add').click(function() {
		console.log($('.form-control').val());
		activity = $('.form-control').val();
		$('ul').append('<li class="activity-item">' + activity + '</li>			<button class="btn btn-default delete">Delete</button>');
		$('.delete').click(function() {
			$(this).remove();
		});
		$('.empty-text').hide();
	});

	$('.delete').on('click', function() {
		console.log('hello world');
		$('.activity-item').remove();
	});
// var newActivityItem = 

	
};

$(document).ready(main);
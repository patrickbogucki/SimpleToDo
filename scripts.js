var main = function() {
	var activity;
	$('.add').click(function() {
		console.log($('.form-control').val());
		activity = $('.form-control').val();
		$('ul').append('<li class="activity-item">' + activity + '<button class="btn btn-default delete">Delete</button> </li>');
		$('.delete').click(function() {
			$(this).parent().fadeOut('slow', function() {
				$(this).remove();
			});
			if(!$('.activities').has('li')) {
				$('.empty-text').removeClass('empty')
			}
		});
		$('.empty-text').addClass('empty');
		
	});

	$('.delete').on('click', function() {
		console.log('hello world');
		$('.activity-item').remove();
	});
	$('.delete-all').on('click', function() {
		$('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			$('.empty-text').removeClass('empty');
		});
	});
// var newActivityItem = 

	
};

$(document).ready(main);
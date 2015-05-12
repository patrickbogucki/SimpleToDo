var main = function() {
	var activity;

	$('.add').click(function() {
		console.log($('.form-control').val());
		activity = $('.form-control').val();

		if(activity === '') {
			alert('Please enter an activity.');
		} else {
			$('.form-control').val('');

			$('ul').append(activity_item_html(activity));

			$('.delete').click(function() {
				$(this).parent().fadeOut('slow', function() {
					$(this).remove();
					if($('.activities li').length === 0) {
						$('.empty-text').removeClass('empty');
					}
				});
			});

			$('.empty-text').addClass('empty');
		}

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


	$('.delete-selected').click(function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).closest('li').fadeOut('slow', function() {
					$(this).remove();
				if($('.activities li').length === 0) {
					$('.empty-text').removeClass('empty');
				}
				});
			}
		});
		
	});

	$('.delete-all').on('click', function() {
		$('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			$('.empty-text').removeClass('empty');
		});
	});
	
};

var activity_item_html = function(activity) { 
		return '<li class="activity-item"><div class="activity-text"><input type="checkbox" name="activity" class=activity-checkbox>' + activity + '</div><button class="btn btn-default btn-xs edit">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></li>';
	};

$(document).ready(main);
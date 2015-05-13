var max_word_count = 100;

var main = function() {
	var activity;
	var wordsRemaining;

	resetWordCounter();
	initWordCounter($('.new-activity-textbox'));

	$('.edit-activity-textbox').attr('maxlength', max_word_count);


	$('.add').click(function() {
		console.log($('.new-activity-textbox').val());
		activity = $('.new-activity-textbox');
		if(activity.val() === '') {
			alert('Please enter an activity.');
		} else {
			$('ul').append(activity_item_html(activity.val()));
			
			$('.new-activity-textbox').val('');

			$('.edit').on('click', function() {
				console.log('hi');
				$('#editModal').modal('show');
				initWordCounter($('.edit-activity-textbox'));
			});

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
		resetWordCounter();
		$('.new-activity-textbox').focus();
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


	$('.btn-modal-close').click(function() {
		resetWordCounter();
	});
	
};

var resetWordCounter = function() {
	$('.word-count-value').text(max_word_count);
};

var initWordCounter = function(textbox) {
	textbox.attr('maxlength', max_word_count);
	textbox.focus();
	textbox.keyup(function() {
		console.log('hello');
		$('.word-count-value').text(function() {
				wordsRemaining = max_word_count - textbox.val().length;

				return wordsRemaining;
			});
	});
};

var activity_item_html = function(activity) { 
		return '<li class="activity-item"><div class="activity-text"><input type="checkbox" name="activity" class=activity-checkbox>' + activity + '</div><button class="btn btn-default btn-xs edit" target="#editModal">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></li>';
	};

$(document).ready(main);
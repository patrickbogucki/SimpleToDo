var max_word_count = 100;

var main = function() {
	var activity;
	var wordsRemaining;
	var newEditText;
	var selectedActivity;

	resetWordCounter();
	initWordCounter($('.new-activity-textbox'));
	$('.edit-activity-textbox').attr('maxlength', max_word_count);

	$('form').on('click', '.add', function() {
		activity = $('.new-activity-textbox');
		if(activity.val() === '') {
			alert('Please enter an activity.');
		} else {
			$('ul').append(activity_item_html(activity.val()));
			$('.new-activity-textbox').val('');
			$('.empty-text').addClass('empty');
		}
		resetWordCounter();
		$('.new-activity-textbox').focus();
	});

	$('.activities').on('click', '.edit', function() {
		$('#editModal').modal({
			backdrop: 'static',
			keyboard: false
		});

		selectedActivity = $(this).prev('.activity-text');
		$('#editModal').modal('show');
		$('.edit-activity-textbox').val(selectedActivity.text());
	});

	$('#editModal').on('shown.bs.modal', function() {
		initWordCounter($('.edit-activity-textbox'));
		$('.edit-activity-textbox').focus();
	});
	$('#editModal').on('hidden.bs.modal', function() {
		resetWordCounter();
	});

	$('#editModal').on('click', '.save', function() {
		var newEditText = $('.edit-activity-textbox').val();
		if(newEditText !== '') {
			selectedActivity.find('p').text(newEditText);
			$(this).closest('.modal').modal('hide');
		} else {
			alert('Please enter an activity');
		}
	});

	$('.activities').on('click', '.delete', function() {
		$(this).parent().fadeOut('slow', function() {
			$(this).remove();
			if($('.activities li').length === 0) {
				$('.empty-text').removeClass('empty');
			}
		});
	});

	$('.delete-selected').on('click', function() {
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
	
	function resetWordCounter() {
		$(this).closest('form').find('.word-count-value').text(max_word_count);
	}

	function initWordCounter(textbox) {
		var wordCount = textbox.closest('form').find('.word-count-value');
		textbox.attr('maxlength', max_word_count);
		textbox.focus();
		textbox.keyup(function() {
			wordCount.text(function() {
				wordsRemaining = max_word_count - textbox.val().length;
				return wordsRemaining;
			});
		});
		textbox.focus(function() {
			wordCount.text(function() {
				wordsRemaining = max_word_count - textbox.val().length;
				return wordsRemaining;
			});
		});
	}
};

var activity_item_html = function(activity) { 
	return '<li class="activity-item"><div class="activity-text"><input type="checkbox" name="activity" class=activity-checkbox><p>' + activity + '</p></div><button class="btn btn-default btn-xs edit" target="#editModal">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></li>';
};

$(document).ready(main);
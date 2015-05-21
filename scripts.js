var max_word_count = 200;
var max_line_char_length = 50;

var main = function() {
	var activity;
	var wordsRemaining;
	var newEditText;
	var selectedActivity;

	$('.word-count-value').text(max_word_count);
	initWordCounter($('.new-activity-textbox'));
	$('.edit-activity-textbox').attr('maxlength', max_word_count);

	$('form').on('click', '.add', function() {
		activity = $('.new-activity-textbox');
		if(activity.val() === '') {
			alert('Please enter an activity.');
		} else {
			$('.activities').prepend(activity_item_html(activity.val()));
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

		selectedActivity = $(this).closest('.row').find('.activity-text');
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
		$(this).closest('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			checkForActivities();
		});
	});

	$('.select-all').on('click', function() {
		$('.activity-item').each(function() {
			$(this).find('.activity-checkbox').prop('checked', true);
		});
	});

	$('.completed-selected').on('click', function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).prop('checked', false);
				var activityItem = $(this).closest('.activity-item');
				activityItem.appendTo('.activities');
				activityItem.find('.activity-text').addClass('completed-activity');
				$(this).hide();
				activityItem.find('.edit').hide();
			}
		});
	});

	// Go through list of items and remove any that have the class 'completed-activity'
	// If there are no activities left, add message in place of activities
	$('.delete-completed').on('click', function() {
		$('.completed-activity').each(function() {
			var activityItem = $(this).closest('li');
			activityItem.fadeOut('slow', function() {
				activityItem.remove();
				checkForActivities();
			});
		});
	});

	$('.delete-selected').on('click', function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).closest('li').fadeOut('slow', function() {
					$(this).remove();
					checkForActivities();
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

	// Checks for activities. If there are none, it removes a class so the area can display a message to the user
	function checkForActivities() {
		if($('.activities li').length === 0) {
			$('.empty-text').removeClass('empty');
		}
	}

};

var activity_item_html = function(activity) { 
	return '<li class="activity-item"><div class="row"><div class="col-xs-2 col-sm-1 activity-checkbox-col"><input type="checkbox" name="activity" class="activity-checkbox"></div><div class="col-xs-10 col-sm-8 activity-text"><p>' + activity + '</p></div><div class="col-xs-12 col-sm-3 activity-buttons"><button class="btn btn-default btn-xs expand">&#43;</button><button class="btn btn-default btn-xs edit" target="#editModal">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></div></div></li>';
};

$(document).ready(main);
/*
Possible Future Features To Add
-Choice of item to add to list (Activity / Item with adjustable quantities)
-Storing list locally somehow *DONE*
-Hooking up to a database to store and retrieve list
-Some sort of navigation bar to practice using Bootstrap. 
	-Lead to an about page and maybe a settings page?
-Ability to move items around in list via arrows or dragging
*/

var max_word_count = 200;
var max_line_char_length = 50;

function main() {
	var activity;
	var wordsRemaining;
	var newEditText;
	var selectedActivity;

	if(localStorage.getItem('activityList')) {
		$('.activity-list').html(localStorage.getItem('activityList'));
	} else {
		$('.empty-text').removeClass('empty');
	}

	$('.word-count-value').text(max_word_count);
	initWordCounter($('.new-activity-textbox'));
	$('.edit-activity-textbox').attr('maxlength', max_word_count);

	$('form').on('click', '.add', function() {
		activity = $('.new-activity-textbox');
		if(activity.val() === '') {
			// $('.main-alert').stop();
			displayEmptyTextAlert($('.main-alert'));
		} else {
			$('.activities').prepend(activity_item_html());
			var lastActivity = $('.activity-item').first();
			lastActivity.find('p').text(activity.val());
			$('.new-activity-textbox').val('');
			$('.empty-text').addClass('empty');
			updateStorageList();
		}
		resetWordCounter();
		$('.new-activity-textbox').focus();
	});
 
	$('.activities').on('click', '.expand', function() {
		if($(this).html() === '+') {
			$(this).html('&#45;');
		} else {
			$(this).html('&#43;');
		}
		$(this).closest('.activity-item').find('.item-movement').stop().slideToggle('slow');
	});

	$('.activities').on('click', '.item-move-up', function() {
		var activityItem = $(this).closest('.activity-item');
		var prevActivityItem = activityItem.prev();
		prevActivityItem.before(activityItem);
	});	

	// Check if next item element has completed class before moving it
	$('.activities').on('click', '.item-move-down', function() {
		var activityItem = $(this).closest('.activity-item');
		var nextActivityItem = activityItem.next();
		nextActivityItem.after(activityItem);
	});

	$('.activities').on('click', '.item-move-top', function() {
		var activityItem = $(this).closest('.activity-item');
		var firstActivityItem = $('.activity-item').first();
		firstActivityItem.before(activityItem);
	});

	// Select last item. If it is completed, traverse up and add after first item that isn't completed.
	$('.activities').on('click', '.item-move-bottom', function() {
		var activityItem = $(this).closest('.activity-item');
		// var lastActivityItem = $('.activity-item').last();
		var tempBottomActivity = $('.activity-item').last();
		while(true) {
			if(!tempBottomActivity.hasClass('completed-activity')) {
				tempBottomActivity.after(activityItem);
				break;
			} else {
				tempBottomActivity = tempBottomActivity.prev();
			}
		}
		// lastActivityItem.after(activityItem);
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
			updateStorageList();
		} else {
			displayEmptyTextAlert($('.edit-modal-alert'));
			$('.edit-activity-textbox').focus();
		}
	});

	$('.activities').on('click', '.delete', function() {
		$(this).closest('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			checkForActivities();
			updateStorageList();
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
				var activityItem = $(this).closest('.activity-item');
				activityItem.appendTo('.activities');
				activityItem.addClass('completed-activity');
				$(this).remove();
				activityItem.find('.edit').remove();
				updateStorageList();
			}
		});
	});

	// Go through list of items and remove any that have the class 'completed-activity'
	// If there are no activities left, add message in place of activities
	$('.delete-completed').on('click', function() {
		$('.completed-activity').each(function() {
			this.fadeOut('slow', function() {
				this.remove();
				checkForActivities();
				updateStorageList();
			});
		});
	});

	$('.delete-selected').on('click', function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).closest('li').fadeOut('slow', function() {
					$(this).remove();
					checkForActivities();
					updateStorageList();
				});
			}
		});
	});

	$('.delete-all').on('click', function() {
		$('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			$('.empty-text').removeClass('empty');
			updateStorageList();
		});
	});
	
	function updateStorageList() {
		var activityList = $('.activity-list').html();
		localStorage.setItem('activityList', activityList);
	}

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

	function displayEmptyTextAlert(div) {
		div.html('Please enter an activity.');
		div.stop(true, true).animate({opacity: 1}, 400).delay(2000).animate({opacity: 0}, 400);
	}

	// Checks for activities. If there are none, it removes a class so the area can display a message to the user
	function checkForActivities() {
		if($('.activities li').length === 0) {
			$('.empty-text').removeClass('empty');
		}
	}

	function activity_item_html() {
		return '<li class="activity-item"><div class="row"><div class="col-xs-2 col-sm-1 activity-checkbox-col"><input type="checkbox" name="activity" class="activity-checkbox"></div><div class="col-xs-10 col-sm-8 activity-text"><p></p></div><div class="col-xs-12 col-sm-3 activity-buttons"><button class="btn btn-default btn-xs expand">&#43;</button><button class="btn btn-default btn-xs edit" target="#editModal">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></div></div><div class="row item-movement"><div class="col-md-12"><button class="btn btn-default btn-xs item-move-up">Move Up</button><button class="btn btn-default btn-xs item-move-down">Move Down</button><button class="btn btn-default btn-xs item-move-top">Move To Top</button><button class="btn btn-default btn-xs item-move-bottom">Move To Bottom</button></div></div></li>';
	}

}

$(document).ready(main);
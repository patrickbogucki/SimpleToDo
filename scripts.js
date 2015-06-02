/*
FUTURE FEATURES
-Choice of item to add to list (Activity / Item with adjustable quantities)
-Hooking up to a database to store and retrieve list
-Some sort of navigation bar to practice using Bootstrap. 
	-Lead to an about page and maybe a settings page?
*/

/*
BUGS TO FIX
-Items that are in odd order (1, 3, 5...) are taller than even ordered items.
*/

var max_word_count = 200;
var max_line_char_length = 50;

function main() {
	var activity;
	var wordsRemaining;
	var newEditText;
	var selectedActivity;
	var numUncompleteChecked = 0;
	var numCompleteChecked = 0;

	loadFromStorage();

	// Set disabled state of mark selected as completed button.
	// Should be enabled when an item is checked, but no checked item is already marked as completed.
	

	$('.activities').on('click', '.activity-checkbox', function() {
		var activityItem = $(this).closest('.activity-item');
		if($(this).prop('checked') && !activityItem.hasClass('completed-activity')) {
			numUncompleteChecked++;
		}
		else if(!$(this).prop('checked') && !activityItem.hasClass('completed-activity')) {
			numUncompleteChecked--;
		}
		else if($(this).prop('checked') && activityItem.hasClass('completed-activity')) {
			numCompleteChecked++;
		}
		else if(!$(this).prop('checked') && activityItem.hasClass('completed-activity')) {
			numCompleteChecked--;
		}
		setSelectButtons();
		console.log(numUncompleteChecked);
	});

	$('.word-count-value').text(max_word_count);
	initWordCounter($('.new-activity-textbox'));
	$('.edit-activity-textbox').attr('maxlength', max_word_count);

	$('form').on('click', '.add', function() {
		activity = $('.new-activity-textbox');
		if(activity.val() === '') {
 			displayEmptyTextAlert($('.main-alert'));
		} else {
			$('.activities').prepend(activity_item_html());
			var lastActivity = $('.activity-item').first();
			lastActivity.find('p').text(activity.val());
			$('.new-activity-textbox').val('');
			$('.empty-text').addClass('empty');
			$('.select-all').removeClass('disabled');
			$('.delete-all').removeClass('disabled');
			updateToStorageList();
		}
		resetWordCounter();
		$('.new-activity-textbox').focus();
	});
 
 	// Collapses any expanded items and toggles state of clicked item
	$('.activities').on('click', '.expand', function() {
 		if($(this).html() === '+') {
			$(this).html('&#45;');
		} else {
			$(this).html('&#43;');
		}
		var clickedItem = $(this).closest('.activity-item');
		if(!clickedItem.hasClass('expanded')) {
			$('.activity-item').each(function() {
				if($(this).hasClass('expanded')) {
					$(this).removeClass('expanded');
					$(this).find('.expand').html('&#43;');
					$(this).find('.item-movement').stop().slideToggle('slow');
				}
			});
		}
		clickedItem.toggleClass('expanded');
		clickedItem.find('.item-movement').stop().slideToggle('slow');
	});

	$('.activities').on('click', '.item-move-up', function() {
		var activityItem = $(this).closest('.activity-item');
		var prevActivityItem = activityItem.prev();
		prevActivityItem.before(activityItem);
		updateToStorageList();
	});	

	// Check if next item element has completed class before moving it
	$('.activities').on('click', '.item-move-down', function() {
		var activityItem = $(this).closest('.activity-item');
		var nextActivityItem = activityItem.next();
		if(!nextActivityItem.hasClass('completed-activity')) {
			nextActivityItem.after(activityItem);
			updateToStorageList();
		}
	});

	$('.activities').on('click', '.item-move-top', function() {
		var activityItem = $(this).closest('.activity-item');
		var firstActivityItem = $('.activity-item').first();
		firstActivityItem.before(activityItem);
		updateToStorageList();
	});

	// Select last item. If it is completed, traverse up and add after first item that isn't completed.
	$('.activities').on('click', '.item-move-bottom', function() {
		var activityItem = $(this).closest('.activity-item');
		var tempBottomActivity = $('.activity-item').last();
		while(true) {
			if(!tempBottomActivity.hasClass('completed-activity')) {
				tempBottomActivity.after(activityItem);
				updateToStorageList();
				break;
			} else {
				tempBottomActivity = tempBottomActivity.prev();
			}
		}
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
			updateToStorageList();
		} else {
			displayEmptyTextAlert($('.edit-modal-alert'));
			$('.edit-activity-textbox').focus();
		}
	});

	$('.activities').on('click', '.delete', function() {
		$(this).closest('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			checkForActivities();
			checkForCompletedActivities();
			updateToStorageList();
		});
	});

	$('.select-all').on('click', function() {
		numCompleteChecked = 0;
		numUncompleteChecked = 0;
		$('.activity-item').each(function() {
			$(this).find('.activity-checkbox').prop('checked', true);
			if($(this).hasClass('completed-activity')) {
				numCompleteChecked++;
			} else {
				numUncompleteChecked++;
			}
		});
		checkForCompletedActivities();
		setSelectButtons();
	});

	$('.completed-selected').on('click', function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				var activityItem = $(this).closest('.activity-item');
				activityItem.appendTo('.activities');
				activityItem.addClass('completed-activity');
				$(this).prop('checked', false);
				activityItem.find('.expand').remove();
				activityItem.find('.edit').remove();
				activityItem.find('.item-movement').remove();
				resetButtons();
				$('.delete-completed').removeClass('disabled');
				checkForCompletedActivities();
				updateToStorageList();
			}
		});
	});

	// Go through list of items and remove any that have the class 'completed-activity'
	// If there are no activities left, add message in place of activities
	$('.delete-completed').on('click', function() {
		$('.completed-activity').each(function() {
			$(this).fadeOut('slow', function() {
				$(this).remove();
				checkForActivities();
				checkForCompletedActivities();
				updateToStorageList();
			});
		});
	});

	$('.delete-selected').on('click', function() {
		$('.activity-checkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).closest('li').fadeOut('slow', function() {
					$(this).remove();
					checkForActivities();
					checkForCompletedActivities();
					updateToStorageList();
				});
			}
		});
		resetButtons();
	});

	$('.delete-all').on('click', function() {
		$('.activity-item').fadeOut('slow', function() {
			$(this).remove();
			checkForActivities();
			checkForCompletedActivities();
			updateToStorageList();
			resetButtons();
		});
	});
	
	function loadFromStorage() {
		if(localStorage.getItem('activityList')) {
			$('.activity-list').html(localStorage.getItem('activityList'));
			$('.select-all').removeClass('disabled');
			$('.delete-all').removeClass('disabled');
			checkForActivities();
		} else {
			$('.empty-text').removeClass('empty');
		}
	}

	function updateToStorageList() {
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
			$('.select-all').addClass('disabled');
			$('.delete-all').addClass('disabled');
		}
	}

	function checkForCompletedActivities() {
		$('.delete-completed').addClass('disabled');
		$('.activity-item').each(function() {
			if($(this).hasClass('completed-activity')) {
				$('.delete-completed').removeClass('disabled');
				console.log('disabled act');
			}
		});
	}

	function setSelectButtons() {
		if(numUncompleteChecked > 0 && numCompleteChecked === 0) {
			$('.completed-selected').removeClass('disabled');
		} else {
			$('.completed-selected').addClass('disabled');
		}
		if(numUncompleteChecked > 0 || numCompleteChecked > 0) {
			$('.delete-selected').removeClass('disabled');
		} else {
			$('.delete-selected').addClass('disabled');
		}
	}

	function resetButtons() {
		numUncompleteChecked = 0;
		numCompleteChecked = 0;
		$('.completed-selected').addClass('disabled');
		$('.delete-selected').addClass('disabled');
	}

	function activity_item_html() {
		return '<li class="activity-item"><div class="row"><div class="col-xs-2 col-sm-1 activity-checkbox-col"><input type="checkbox" name="activity" class="activity-checkbox"></div><div class="col-xs-10 col-sm-8 activity-text"><p></p></div><div class="col-xs-12 col-sm-3 activity-buttons"><button class="btn btn-default btn-xs expand">&#43;</button><button class="btn btn-default btn-xs edit" target="#editModal">Edit</button><button class="btn btn-default btn-xs delete">Delete</button></div></div><div class="row item-movement"><div class="col-md-12"><button class="btn btn-default btn-xs item-move-up">Move Up</button><button class="btn btn-default btn-xs item-move-down">Move Down</button><button class="btn btn-default btn-xs item-move-top">Move To Top</button><button class="btn btn-default btn-xs item-move-bottom">Move To Bottom</button></div></div></li>';
	}

}

$(document).ready(main);
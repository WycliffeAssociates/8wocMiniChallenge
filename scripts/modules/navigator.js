'use strict';

function Navigator() {

	var bookSelector = document.querySelector('#book-selector'),
		chapterSelector = document.querySelector('#chapter-selector'),
		goButton = document.querySelector('.btn-go');

    return {

    	bookSelector: (function() {
    		return bookSelector;
    	})(),

    	chapterSelector: (function() {
    		return chapterSelector;
    	})(),

    	goButton: (function() {
    		return goButton;
    	})(),

    	updateChapter: function(e) {
    		console.log('updateChapter', e);
    	},

    };

}

exports.Navigator = Navigator;
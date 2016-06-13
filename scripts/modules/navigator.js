'use strict';

function Navigator() {

	var bookSelector = document.querySelector('#book-selector'),
		chapterSelector = document.querySelector('#chapter-selector');

    return {

    	bookSelector: (function() {
    		return bookSelector;
    	})(),

    	chapterSelector: (function() {
    		return chapterSelector;
    	})()

    };

}

exports.Navigator = Navigator;
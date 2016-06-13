'use strict';

function Reader() {

	var readingPane = document.querySelector('.reading-pane');

    return {

    	readingPane:(function() {
    		return readingPane;
    	})(),

    	update: function(book) {
    		console.log('update Reader', book);
    	}

    };

}

exports.Reader = Reader;
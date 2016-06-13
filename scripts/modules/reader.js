'use strict';

function Reader() {

	var readingPane = document.querySelector('.reading-pane');

    return {

    	readingPane:(function() {
    		return readingPane;
    	})(),

    	update: function(e) {
    		console.log('update Reader', e);
    	}

    };

}

exports.Reader = Reader;
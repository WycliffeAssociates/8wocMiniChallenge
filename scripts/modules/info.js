'use strict';

function Info() {

	var infoPane = document.querySelector('.info-pane'),
		paneContent = infoPane.querySelector('.pane-content');

    return {

    	infoPane:(function() {
    		return infoPane;
    	})(),

        showInstruction: function() {
        	console.log('showing');
            var el = '<p class="instruction">Click on a greek word to display its info</p>';
            $(paneContent).children().hide();
            $(paneContent).append(el);
        },

        hideInstruction: function() {
            $(paneContent).children().show();
            $(paneContent).find('.instruction').hide();
        },

    	update: function(strongs) {
    		console.log('info.update', strongs);
    		if (!strongs) {
    			return false;
    		}
    	}

    };

}

exports.Info = Info;
'use strict';

function Info() {

	var infoPane = document.querySelector('.info-pane'),
		paneContent = infoPane.querySelector('.pane-content'),
		wordSelected = infoPane.querySelector('.word-selected'),
		wordStrongs = infoPane.querySelector('.word-strongs'),
		wordMorph = infoPane.querySelector('.word-morph'),
		wordDefBrief = infoPane.querySelector('.word-def-brief'),
		wordDefLong = infoPane.querySelector('.word-def-long'),
		wordCount = infoPane.querySelector('.word-count');

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

    	update: function(info) {
    		if (!info) {
    			return false;
    		}

    		console.log(info);

    		this.hideInstruction();
    		$(wordSelected).html(info.greek);
    		$(wordStrongs).html(info.strongs);
    		// TODO: Parse morphology. PREP -> preposigion, CONJ -> conjunction, etc.
    		$(wordMorph).html(info.morphology);
    		$(wordDefBrief).html(info.brief);
    		$(wordDefLong).html(info.long);
    		$(wordCount).html(info.count);

    	}

    };

}

exports.Info = Info;
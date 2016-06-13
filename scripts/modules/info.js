'use strict';

function Info() {

	var infoPane = document.querySelector('.info-pane');

    return {

    	infoPane:(function() {
    		return infoPane;
    	})(),

    	update: function() {

    	}

    };

}

exports.Info = Info;
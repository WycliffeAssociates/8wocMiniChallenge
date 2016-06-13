'use strict';

function Lexicon() {

	var lexiconMap = {
		'Ephesians': 'lexicon-eph-english',
		'Matthew': 'lexicon-mat-english.json'
	}

	var lexicon;

    return {

    	load: function(book) {
    		var a = './lib/lexicon/lexicon-eph-english.json';
    		lexicon = require(a);
    		console.log(lexicon);
    	},

        getDefinition: function(strongs) {

        }

    };

}

exports.Lexicon = Lexicon;
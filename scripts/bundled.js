(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    // Book = require('./modules/book').Book,
    // Lexicon = require('./modules/lexicon').Lexicon,
    Info = require('./modules/info').Info;

function App() {

    var bookSelector,
        chapterSelector,
        goButton,
        readingPane,
        infoPane;

    return {

        navigator: new Navigator(),

        reader: new Reader(),

        info: new Info(),

        // book: new Book(),

        // lexicon: new Lexicon(),

        init: function() {
            // Register elements
            bookSelector = this.navigator.bookSelector;
            chapterSelector = this.navigator.chapterSelector;
            goButton = this.navigator.goButton;
            readingPane = this.reader.readingPane;
            infoPane = this.reader.infoPane;

            // Register listeners
            bookSelector.addEventListener('change', this.navigator.updateChapter);
            goButton.addEventListener('click', this.reader.update);
        }

    };

}

document.addEventListener('DOMContentLoaded', function() {

    var app = window.app = App();
    app.init();

});

},{"./modules/info":2,"./modules/navigator":3,"./modules/reader":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}]},{},[1]);

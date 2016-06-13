(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    Info = require('./modules/info').Info;

function App() {

    // We may not need this if each elements are going to be defined in modules
    var bookSelector,
        chapterSelector,
        readingPane,
        infoPane,
        content;

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

            // Register listeners
            bookSelector.addEventListener('change', function(e) {
                console.log('bookSelector is changed', e);
            });
            chapterSelector.addEventListener('change', function(e) {
                console.log('chapterSelector is changed', e);
            });
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

    return {

    };

}

exports.Info = Info;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict';

function Reader() {

    return {

    };

}

exports.Reader = Reader;
},{}]},{},[1]);

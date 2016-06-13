(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
<<<<<<< HEAD
var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    Book = require('./modules/book').Book,
    // Lexicon = require('./modules/lexicon').Lexicon,
    Info = require('./modules/info').Info;


function popoverInit(selector) {
    $(selector).popover({
        placement: 'bottom',
        trigger: 'hover',
        html: true
    });
}


function App() {

    var bookSelector,
        chapterSelector,
        goButton,
        readingPane,
        infoPane;

    return {

        book: new Book(),

        // lexicon: new Lexicon(),

        navigator: new Navigator(),

        reader: new Reader(),

        info: new Info(),

        // lexicon: new Lexicon(),

        init: function() {
            // Register elements
            bookSelector = this.navigator.bookSelector;
            chapterSelector = this.navigator.chapterSelector;
            goButton = this.navigator.goButton;
            readingPane = this.reader.readingPane;
            infoPane = this.reader.infoPane;

            // Populate bookSelector
            this.navigator.updateBooks(this.book.bookNames);

            // Show initial instructions
            this.reader.showInstruction();
            this.info.showInstruction();

            // Register listeners
            var app = this;
            
            bookSelector.addEventListener('change', function(e) {
                var book = bookSelector.value;

                app.navigator.updateChapter(app.book.getChapters(book));
            });

            goButton.addEventListener('click', function() {
                var book = bookSelector.value,
                    chapter = chapterSelector.value;

                if (!book || !chapter) {
                    return false;
                } 

                var chapterObject = app.book.getChapter(book, chapter);
                app.reader.hideInstruction();
                app.reader.update(chapterObject);

                popoverInit('.verse-word');
            });

            $(readingPane).on('click', '.verse-word', function(e) {
                var info = app.book.getInfo(e.target.dataset.strongs.replace("G", ""));
                app.info.update(info);
            });

            // Initialize bootstrap components
            popoverInit('.verse-word');
        }

    };

}

document.addEventListener('DOMContentLoaded', function() {

    var app = window.app = App();
    app.init();

});

},{"./modules/book":2,"./modules/info":3,"./modules/navigator":4,"./modules/reader":5}],2:[function(require,module,exports){
'use strict';

function Book() {

    var bible;
    var lexi;
    var index = 0;
    var bookNames = [];
    init();
    
    function init(){
        // TODO: Look at lib/books and get all the available book names
        bookNames = ['Ephesians'];

        parseJSON("lib/books/Ephesians.json", 
            function(json){
                // console.log(json);
                bible = reconfigureBook(json);
            }
         );
        //bible = reconfigureBook(bible);
        //printVerse("Ephesians", "1", "2");

        parseJSON("lib/lexicon/lexicon-eph-english.json", 
            function(json){
                // console.log(json);
                lexi = json;
            }
        );
    }

    function getDefinition(strongs){
        var result = "";
        for(var i = 0; i < lexi.length; i++){
            if(lexi[i]["strongs"].includes(strongs)){
                // console.log(lexi[i]["long"]);
                return lexi[i];
            }
        }
        return result;
    }

    function getVerse(book, chapter, verse){
        if(typeof chapter === 'number'){
            chapter = chapter.toString();
        }
        if(typeof verse === 'number'){
            verse = verse.toString();
        }
        var string = "";
        string += '<li class="verse">';
        string += '<span class="verse-number">' + verse + '</span>';
        string += '<span class="verse-text">';
        for(var i =0; i < bible[book][chapter][verse].length; i++){
            var word = bible[book][chapter][verse][i];
            var definition = getDefinition(word["strongs"].replace("G", ""));
            string += '<span class="verse-word" tabindex="0" role="button" data-toggle="popover" data-html="true" data-strongs="' + word["strongs"] + '"  data-content="';
            string += '<p>Strongs: ' + word["strongs"] + '</p><p>Morphology: ' + word["morph"] + '</p><p>' + (definition.long || '') + '</p>';
            string += '">' + word["greek"] + '</span> ';
        }
        string += '</span>';
        string += '</li>';
        return string;
    }

    function getNumChapters(bookName){
        return Object.keys(bible[bookName]).length;
    }

    function getNumVerses(bookName, chapter){
        if(typeof chapter === 'number'){
            chapter = chapter.toString();
        }
        return Object.keys(bible[bookName][chapter]).length;
    }

    function parseJSON(jsonFile, onParse){
        // console.log(jsonFile);
        // var  xhttp = new XMLHttpRequest();
        // xhttp.open("GET", "lib/books/"+jsonFile, false);
        // xhttp.overrideMimeType("application/json");
        // xhttp.send(null);    
        // var Doc = xhttp.responseText;
        // return JSON.parse(Doc);
        $.ajax({
            url: jsonFile,
            beforeSend: function(xhr){
                if (xhr.overrideMimeType){
                    xhr.overrideMimeType("application/json");
                }
            },
            dataType: 'json',
            success: onParse
        });
    }

    function reconfigureBook(parsedBookJson){
        for(var i = 1; i < Object.keys(parsedBookJson["Ephesians"]).length + 1; i++){
                //console.log("hi " + Object.keys(parsedBookJson["Ephesians"][(i +1).toString()]).length);
            for(var j = 1; j < Object.keys(parsedBookJson["Ephesians"][i.toString()]).length + 1; j++){
                var re = new RegExp(/([α-ωΑ-Ω]+) (G[0-9]+)[ G[0-9]+]* ([A-Z]+[0-9]*[-[0-9]*[A-Z]*[0-9]*]*)/, "g");
                var verse = parsedBookJson["Ephesians"][i.toString()][j.toString()].replace(/ \{.*\} /,"").replace(/ \[/, "").replace(/\]/,"");//.split(" ");
                var results = [];
                var m = [];
                do {
                    m = re.exec(verse);
                    if (m) {
                        results.push(m);
                    }
                } while (m);
                parsedBookJson["Ephesians"][i.toString()][j.toString()] = [];
                for(var k = 0; k < results.length; k++){
                    //strongs is different because of a (possibly javascript itself?) bug
                    var temp = {"greek":results[k][1], "strongs":results[k][0].split(" ")[1], "morph":results[k][3]};
                    // console.log(verse);
                    // console.log("strongs", results[k][0].split(" ")[1]);
                    // console.log("results", results[0]);
                    parsedBookJson["Ephesians"][i.toString()][j.toString()].push(temp);
                }
            }
        }
        // console.log(parsedBookJson);
        return parsedBookJson;
    }


    return {

        bookNames: (function() {
            return bookNames;
        })(),

        //
        getBook: function(bookName) {
            return bible;
        },

        getChapters: function(bookName) {
            return getNumChapters(bookName);
        },

        getVerse: function(book, chapter, verse) {
            return getVerse(book, chapter, verse);
        },

        getChapter: function(book, chapter, verse){
            var numVerses = getNumVerses(book, chapter);
            var string = "";
            for(var i = 1, length = numVerses+1; i < length; i++){
                string += getVerse(book, chapter, i);
            }
            return {
                title: book,
                chapter: chapter,
                content: string
            };
        },

        getInfo: function(strongs) {
            return getDefinition(strongs);
        }

    };

}

exports.Book = Book;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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

        updateBooks: function(bookNames) {
            bookNames.forEach(function(bookName) {
                var el = '<option value="' + bookName + '">' + bookName + '</option>';
                $(bookSelector).append(el);
            });
        },

        updateChapter: function(chapters) {
            for(var i = 1, length = chapters + 1; i < length; i++) {
                var el = '<option value="' + i + '">' + "Chapter " + i + '</option>';
                $(chapterSelector).append(el);
            }
        },

=======
var Test = require('./modules/test').Test;

window.App = {

    Test: Test('curry'),

    el: {
        bookSelector: undefined,
        chapterSelector: undefined,
        readingPane: undefined,
        infoPane: undefined,
    },

    Book: Material(),

    lexicon: Lexicon(),

    init: function() {
        // Register elements
        this.el.bookSelector = document.querySelector('#book-selector');
        this.el.chapterSelector = document.querySelector('#chapter-selector');
        this.el.readingPane = document.querySelector('.reading-pane');
        this.el.infoPane = document.querySelector('.info-pane');
        this.el.content = document.querySelector('.content');

        // Register listeners

    }

};

document.addEventListener('DOMContentLoaded', function() {

    App.init();

});

},{"./modules/test":2}],2:[function(require,module,exports){
'use strict';

function Test() {

    return {

        a: "hello",

        b: "sup",
>>>>>>> 898552aa467b5ed7fa2f0405366a3cab3827f03b
    };

}

<<<<<<< HEAD
exports.Navigator = Navigator;
},{}],5:[function(require,module,exports){
'use strict';

function Reader() {

    var readingPane = document.querySelector('.reading-pane'),
        paneContent = readingPane.querySelector('.pane-content'),
        title = readingPane.querySelector('.book-title'),
        chapter = readingPane.querySelector('.book-chapter'),
        content = readingPane.querySelector('.book-content');

    return {

        readingPane:(function() {
            return readingPane;
        })(),

        showInstruction: function() {
            var el = '<p class="instruction">Select book and chapter, then click "go"</p>';
            $(paneContent).children().hide();
            $(paneContent).append(el);
        },

        hideInstruction: function() {
            $(paneContent).children().show();
            $(paneContent).find('.instruction').hide();
        },

        update: function(chapterObject) {
            $(title).html(chapterObject.title);
            $(chapter).html(chapterObject.chapter);
            $(content).empty();
            $(content).append(chapterObject.content);
        }

    };

}

exports.Reader = Reader;
=======
exports.Test = Test;

>>>>>>> 898552aa467b5ed7fa2f0405366a3cab3827f03b
},{}]},{},[1]);

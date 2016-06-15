(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    Book = require('./modules/book').Book,
    Info = require('./modules/info').Info;

var utils = require('./modules/utils').utils;


function popoverInit(selector) {
    $(selector).popover({
        placement: 'auto bottom',
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

        navigator: new Navigator(),

        reader: new Reader(),

        info: new Info(),

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
                console.log('click verse-word', e.target, info);
                app.info.updateSingleWord(info);
            });

            readingPane.addEventListener('mousedown', function(e) {
                console.log('mousedown');
                // Reset selection
                var sel = window.getSelection();
                sel.collapse(readingPane, 0);
                sel.removeAllRanges();
            });

            readingPane.addEventListener('mouseup', function(e) {
                console.log('mouseup');
                utils.snapSelectionToWord();

                var sel = window.getSelection();
                if (!sel.isCollapsed) {
                    app.reader.selectedText = sel.toString().replace(/([^α-ωΑ-Ω\s])+|\s{2,}|[\t\r\n]+/gi, '');
                    app.reader.formatText(sel, bookSelector.value, chapterSelector.value);

                    app.info.updateMultiWord(app.reader.formattedText, app.reader.formattedRef);

                    document.execCommand('copy');
                }
            });

            readingPane.addEventListener('copy', function (e) {
                // NOTE: http://stackoverflow.com/questions/9658282/javascript-cut-copy-paste-to-clipboard-how-did-google-solve-it
                var text = app.reader.formattedText + '\n' + app.reader.formattedRef;
                e.clipboardData.setData('text/plain', text);
                e.preventDefault();
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

},{"./modules/book":2,"./modules/info":3,"./modules/navigator":4,"./modules/reader":5,"./modules/utils":6}],2:[function(require,module,exports){
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
        var chapter = bible[book][chapter][verse];
        for(var i = 0; i < chapter.length; i++){
            var word = chapter[i];
            var definition = getDefinition(word["strongs"].replace("G", ""));
            string += '<span class="verse-word" data-html="true" data-verse="' + verse + '" data-word="' + (i+1) + '"  data-last="' + (i === chapter.length - 1 ? 'true' : 'false') + '" data-strongs="' + word.strongs + '"  data-content="';
            string += word.strongs + '<br />' + word.morph + '<br />' + (definition.brief || '');
            string += '">' + word.greek + '</span> ';
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
                var re = new RegExp(/([α-ωΑ-Ω]+) (G[0-9]+)( G[0-9]+)* ([A-Z]+[0-9]*[-[0-9]*[A-Z]*[0-9]*]*)/, "g");
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
                    var temp = {"greek":results[k][1], "strongs":results[k][2], "morph":results[k][4]};
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
        singleWordInfo = infoPane.querySelector('.single-word-info'),
        wordSelected = singleWordInfo.querySelector('.word-selected'),
        wordStrongs = singleWordInfo.querySelector('.word-strongs'),
        wordMorph = singleWordInfo.querySelector('.word-morph'),
        wordDefBrief = singleWordInfo.querySelector('.word-def-brief'),
        wordDefLong = singleWordInfo.querySelector('.word-def-long'),
        wordCount = singleWordInfo.querySelector('.word-count'),
        multiWordInfo = infoPane.querySelector('.multi-word-info');

    return {

        infoPane:(function() {
            return infoPane;
        })(),

        showInstruction: function() {
            var el = '<p class="instruction">Click on a greek word to display its info</p>';
            $(paneContent).children().hide();
            $(paneContent).append(el);
        },

        hideInstruction: function() {
            $(paneContent).children().show();
            $(paneContent).find('.instruction').hide();
        },

        updateSingleWord: function(info) {
            this.hideInstruction();

            $(wordSelected).html(info.greek);
            $(wordStrongs).html(info.strongs);
            // TODO: Parse morphology. PREP -> preposigion, CONJ -> conjunction, etc.
            $(wordMorph).html(info.morphology);
            $(wordDefBrief).html(info.brief);
            $(wordDefLong).html(info.long);
            $(wordCount).html(info.count);
        },

        updateMultiWord: function(formattedText, formattedRef) {
            this.hideInstruction();
            // formattedText = formattedText.replace(/\d+./gi, 'ALOHA');
            $(multiWordInfo).html(formattedText + '<br/>' + formattedRef);
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

    };

}

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

        // Pure text based on user selection
        selectedText: '',

        // Like selectedText, but includes the verse number
        formattedText: '',

        formattedRef: '',

        formatText: function(sel, bookName, chapterNumber) {
            var range = sel.getRangeAt(0),
                docFragment = range.cloneContents(),
                nodes = docFragment.querySelectorAll('.verse-word'),
                words = Array.prototype.slice.call(nodes),
                firstWord = words[0],
                lastWord = words[words.length - 1],
                bookName = bookName || 'Book Name',
                formattedText = "",
                startVerse = firstWord.dataset.verse,
                startWord = firstWord.dataset.word,
                endVerse = lastWord.dataset.verse,
                endWord = lastWord.dataset.word;

            range.detach();

            words.forEach(function(word, index, words) {
                formattedText += word.innerText + ' ';
                if ((index + 1 < words.length) && (words[index+1].dataset.verse > word.dataset.verse) ){
                    formattedText += ' ' + words[index+1].dataset.verse.toString() + ". ";
                }
            });

            formattedText = formattedText.trim();

            // If first word selected is the beginning of the verse, add verse number in front of it.
            if(startWord == 1){
                formattedText = startVerse.toString() + ". " + formattedText;
            }

            // Format the reference
            var verseRange = bookName + ' ' + chapterNumber + ':' + startVerse;

            if(startVerse != endVerse){
                if(startWord > 1){
                    verseRange += ' (word ' + startWord + ')';
                }
                verseRange += ' - ' + endVerse;
                verseRange += ' (word ' + endWord + ')';
            } else {
                if(startWord != endWord){
                    verseRange += ' (words ' + startWord + '-' + endWord + ')';
                } else {
                    verseRange += ' (word ' + startWord + ')';
                }
            }

            this.formattedText = formattedText;
            this.formattedRef = verseRange;
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
},{}],6:[function(require,module,exports){
'use strict';

function utils() {

    return {
        snapSelectionToWord: function() {
            var sel;

            // Check for existence of window.getSelection() and that it has a
            // modify() method. IE 9 has both selection APIs but no modify() method.
            if (window.getSelection && (sel = window.getSelection()).modify) {
                sel = window.getSelection();
                if (!sel.isCollapsed) {

                    // Detect if selection is backwards
                    var range = document.createRange();
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    var backwards = range.collapsed;
                    range.detach();

                    // modify() works on the focus of the selection
                    var endNode = sel.focusNode, endOffset = sel.focusOffset;
                    sel.collapse(sel.anchorNode, sel.anchorOffset);
                    
                    var direction = backwards ? ['backward', 'forward'] : ['forward', 'backward'];

                    sel.modify("move", direction[0], "character");
                    sel.modify("move", direction[1], "word");
                    sel.extend(endNode, endOffset);
                    sel.modify("extend", direction[1], "character");
                    sel.modify("extend", direction[0], "word");
                }
            }
            else if ( (sel = document.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                if (textRange.text) {
                    textRange.expand("word");
                    // Move the end back to not include the word's trailing space(s),
                    // if necessary
                    while (/\s$/.test(textRange.text)) {
                        textRange.moveEnd("character", -2);
                    }
                    textRange.select();
                }
            }
        }
    };

}

exports.utils = utils();
},{}]},{},[1]);

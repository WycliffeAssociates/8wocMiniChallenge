var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    // Book = require('./modules/book').Book,
    // Lexicon = require('./modules/lexicon').Lexicon,
    Info = require('./modules/info').Info;

function App() {

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
                // this.navigator.updateChapter();
            });
            chapterSelector.addEventListener('change', function(e) {
                console.log('chapterSelector is changed', e);
                // this.navigator.updateText();
            });
        }

    };

}

document.addEventListener('DOMContentLoaded', function() {

    var app = window.app = App();

    app.init();

});

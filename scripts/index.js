var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    Book = require('./modules/book').Book,
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

        book: new Book(),

        // lexicon: new Lexicon(),

        init: function() {
            // Register elements
            bookSelector = this.navigator.bookSelector;
            chapterSelector = this.navigator.chapterSelector;
            goButton = this.navigator.goButton;
            readingPane = this.reader.readingPane;
            infoPane = this.reader.infoPane;

            // Register listeners
            bookSelector.addEventListener('change', function(e) {
                book = 'Ephesians';
                var chapters = this.book.getChapters(book);
                this.navigator.updateChapter(chapters);
            });
            goButton.addEventListener('click', this.reader.update);
        }

    };

}

document.addEventListener('DOMContentLoaded', function() {

    var app = window.app = App();
    app.init();

});

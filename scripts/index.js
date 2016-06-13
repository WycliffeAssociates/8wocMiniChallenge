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

        book: new Book(),

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

            // Populate dropdown
            this.navigator.updateBooks(this.book.bookNames);

            // Register listeners
            var app = this;
            bookSelector.addEventListener('change', function(e) {
                // TODO: Get new value from bookSelector
                var book = 'Ephesians',
                    chapters = app.book.getChapters(book);

                app.navigator.updateChapter(chapters);
            });
            goButton.addEventListener('click', function(e) {
                // var selectedBook = app.bookSelector.value(),
                    // selectedChapter = app.chapterSelector.value();
                // book = app.book.getBook('Ephesians');
                // app.reader.update(book);

                var verse = app.book.getVerse('Ephesians', 1, 1);
                $('.pane-content ul').append(verse);
                $('.verse-word').popover();
            });

            // Initialize bootstrap components
            $('.verse-word').popover();
        }

    };

}

document.addEventListener('DOMContentLoaded', function() {

    var app = window.app = App();
    app.init();

});

var Navigator = require('./modules/navigator').Navigator,
    Reader = require('./modules/reader').Reader,
    Book = require('./modules/book').Book,
    Info = require('./modules/info').Info;

var utils = require('./modules/utils').utils;


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
                app.info.update(info);
            });

            readingPane.addEventListener('mouseup', function(e) {
                document.execCommand("copy");
            });

            //solution from http://stackoverflow.com/questions/9658282/javascript-cut-copy-paste-to-clipboard-how-did-google-solve-it
            document.addEventListener('copy', function (ev) {
                console.log('copy event');

                //modify selection to grab full words
                // console.log(e.target);
                utils.snapSelectionToWord();
                // console.log("anchor", window.getSelection().anchorNode);
                // console.log("focus", window.getSelection().focusNode);

                var raw = window.getSelection().toString();
                var refined = raw.replace(/([^α-ωΑ-Ω\s])+|\s{2,}|[\t\r\n]+/gi, '');
                // refined && console.log(refined);

                // you can set clipboard data here, e.g.
                ev.clipboardData.setData('text/plain', refined);
                // you need to prevent default behaviour here, otherwise browser will overwrite your content with currently selected 
                ev.preventDefault();
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

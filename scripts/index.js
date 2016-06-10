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

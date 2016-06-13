'use strict';

function Navigator() {

    var bookSelector = document.querySelector('#book-selector'),
        chapterSelector = document.querySelector('#chapter-selector'),
        goButton = document.querySelector('.btn-go');

    // TODO: Update bookSelector to list bookNames as options

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
            for (var i = 0; i < chapters; i++) {
                var chapter = (i + 1).toString(),
                    el = '<option value="' + chapter + '">' + chapter + '</option>';
                $(chapterSelector).append(el);
            }
        },

    };

}

exports.Navigator = Navigator;
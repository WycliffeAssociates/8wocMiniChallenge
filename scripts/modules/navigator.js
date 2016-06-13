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
            console.log('populateDropdown', bookNames);
            bookNames.forEach(function(bookName) {
                var el = '<option value="' + bookName + '">' + bookName + '</option>';
                $(bookSelector).append(el);
            });
        },

        updateChapter: function(chapters) {
            console.log('updateChapter', chapters);
            // TODO: Reset chapterSelector with the correct number of chapters
            for(var i = 1; i < chapters+1; i++){
                var el = '<option value="' + i + '">' + "Chapter " + i + '</option>';
                $(chapterSelector).append(el) ;
            }
        },

    };

}

exports.Navigator = Navigator;
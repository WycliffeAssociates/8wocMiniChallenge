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
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
            // if (!info) {
            //     return false;
            // }

            this.hideInstruction();
            $(wordSelected).html(info.greek);
            $(wordStrongs).html(info.strongs);
            // TODO: Parse morphology. PREP -> preposigion, CONJ -> conjunction, etc.
            $(wordMorph).html(info.morphology);
            $(wordDefBrief).html(info.brief);
            $(wordDefLong).html(info.long);
            $(wordCount).html(info.count);

        },

        updateMultiWord: function(sel, selectedText) {
            if (!sel.isCollapsed && sel.anchorNode != sel.focusNode) {
                var range = sel.getRangeAt(0);
                var nodes = range.cloneContents();
                range.detach();

                var words = nodes.querySelectorAll('.verse-word');
                words = Array.prototype.slice.call(words);
                
                // var index = 0;
                // for(var i = 0; i < words.length; i++){
                //     var word = words[i];
                //     index += words[i].innerText.length + 1;
                //     if( (i+1 < words.length) && (words[i+1].dataset.verse > word.dataset.verse) ){
                //         var insertingText = ' ' + words[i+1].dataset.verse.toString() + ". ";
                //         var part1 = selectedText.slice(0, index);
                //         var part2 = selectedText.slice(index);
                //         selectedText = part1 + words[i+1].dataset.verse.toString() + part2;
                //         index += insertingText.length;
                //     }
                // }

                selectedText = "";
                for(var i = 0; i < words.length; i++){
                    var word = words[i];
                    selectedText += words[i].innerText + ' ';
                    if( (i+1 < words.length) && (words[i+1].dataset.verse > word.dataset.verse) ){
                        selectedText += ' ' + words[i+1].dataset.verse.toString() + ". ";
                    }
                }

                var chapter = words[0].dataset.chapter;
                var startVerse = words[0].dataset.verse;
                var startWord = words[0].dataset.word;
                var endVerse = words[words.length-1].dataset.verse;
                var endWord = words[words.length-1].dataset.word;

                if(startWord == 1){
                    selectedText = startVerse.toString() + ". " + selectedText;
                }

                console.log("current word", words[words.length-1]);
                var el = words[words.length-1];
                var vs = el.dataset.verse;
                var wd = el.dataset.word;
                var verseRange = "Ephesians " + chapter + ':' + startVerse;
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
                return selectedText + '\n' + verseRange;
            }
        }

    };

}

exports.Info = Info;
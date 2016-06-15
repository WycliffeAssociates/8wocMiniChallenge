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
            $(wordSelected).html(info.greek);
            $(wordStrongs).html(info.strongs);
            // TODO: Parse morphology. PREP -> preposigion, CONJ -> conjunction, etc.
            $(wordMorph).html(info.morphology);
            $(wordDefBrief).html(info.brief);
            $(wordDefLong).html(info.long);
            $(wordCount).html(info.count);
        },

        updateMultiWord: function(formattedText, formattedRef) {
            // formattedText = formattedText.replace(/\d+./gi, 'ALOHA');
            $(multiWordInfo).html(formattedText + '<br/>' + formattedRef);
        }

    };

}

exports.Info = Info;
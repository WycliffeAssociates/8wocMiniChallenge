'use strict';

function utils() {

    return {
        // TODO: Buggy. Try selecting a paragraph and then click somewhere in the middle of the selection.
        //       It adds another word instead of clearing previous selection.
        snapSelectionToWord: function() {
            var sel;

            // Check for existence of window.getSelection() and that it has a
            // modify() method. IE 9 has both selection APIs but no modify() method.
            if (window.getSelection && (sel = window.getSelection()).modify) {
                sel = window.getSelection();
                if (!sel.isCollapsed) {

                    // Detect if selection is backwards
                    var range = document.createRange();
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    var backwards = range.collapsed;
                    range.detach();

                    // modify() works on the focus of the selection
                    var endNode = sel.focusNode, endOffset = sel.focusOffset;
                    sel.collapse(sel.anchorNode, sel.anchorOffset);
                    
                    var direction = backwards ? ['backward', 'forward'] : ['forward', 'backward'];

                    sel.modify("move", direction[0], "character");
                    sel.modify("move", direction[1], "word");
                    sel.extend(endNode, endOffset);
                    sel.modify("extend", direction[1], "character");
                    sel.modify("extend", direction[0], "word");
                }
            }
            else if ( (sel = document.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                if (textRange.text) {
                    textRange.expand("word");
                    // Move the end back to not include the word's trailing space(s),
                    // if necessary
                    while (/\s$/.test(textRange.text)) {
                        textRange.moveEnd("character", -2);
                    }
                    textRange.select();
                }
            }
        }
    };

}

exports.utils = utils();
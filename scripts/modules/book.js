'use strict';

function Book() {

    var bible;
    var lexi;
    var index = 0;
    var bookNames = [];
    init();
    
    function init(){
        // TODO: Look at lib/books and get all the available book names
        bookNames = ['Ephesians'];

        parseJSON("lib/books/Ephesians.json", 
            function(json){
                // console.log(json);
                bible = reconfigureBook(json);
            }
         );
        //bible = reconfigureBook(bible);
        //printVerse("Ephesians", "1", "2");

        parseJSON("lib/lexicon/lexicon-eph-english.json", 
            function(json){
                // console.log(json);
                lexi = json;
            }
        );
    }

    function getDefinition(strongs){
        var result = "";
        for(var i = 0; i < lexi.length; i++){
            if(lexi[i]["strongs"].includes(strongs)){
                // console.log(lexi[i]["long"]);
                return lexi[i];
            }
        }
        return result;
    }

    function getVerse(book, chapter, verse){
        if(typeof chapter === 'number'){
            chapter = chapter.toString();
        }
        if(typeof verse === 'number'){
            verse = verse.toString();
        }
        var string = "";
        string += '<li class="verse">';
        string += '<span class="verse-number">' + verse + '</span>';
        string += '<span class="verse-text">';
        var chapter = bible[book][chapter][verse];
        for(var i = 0; i < chapter.length; i++){
            var word = chapter[i];
            var definition = getDefinition(word["strongs"].replace("G", ""));
            string += '<span class="verse-word" data-html="true" data-verse="' + verse + '" data-word="' + (i+1) + '"  data-last="' + (i === chapter.length - 1 ? 'true' : 'false') + '" data-strongs="' + word.strongs + '"  data-content="';
            string += word.strongs + '<br />' + word.morph + '<br />' + (definition.brief || '');
            string += '">' + word.greek + '</span> ';
        }
        string += '</span>';
        string += '</li>';
        return string;
    }

    function getNumChapters(bookName){
        return Object.keys(bible[bookName]).length;
    }

    function getNumVerses(bookName, chapter){
        if(typeof chapter === 'number'){
            chapter = chapter.toString();
        }
        return Object.keys(bible[bookName][chapter]).length;
    }

    function parseJSON(jsonFile, onParse){
        // console.log(jsonFile);
        // var  xhttp = new XMLHttpRequest();
        // xhttp.open("GET", "lib/books/"+jsonFile, false);
        // xhttp.overrideMimeType("application/json");
        // xhttp.send(null);    
        // var Doc = xhttp.responseText;
        // return JSON.parse(Doc);
        $.ajax({
            url: jsonFile,
            beforeSend: function(xhr){
                if (xhr.overrideMimeType){
                    xhr.overrideMimeType("application/json");
                }
            },
            dataType: 'json',
            success: onParse
        });
    }

    function reconfigureBook(parsedBookJson){
        for(var i = 1; i < Object.keys(parsedBookJson["Ephesians"]).length + 1; i++){
                //console.log("hi " + Object.keys(parsedBookJson["Ephesians"][(i +1).toString()]).length);
            for(var j = 1; j < Object.keys(parsedBookJson["Ephesians"][i.toString()]).length + 1; j++){
                var re = new RegExp(/([α-ωΑ-Ω]+) (G[0-9]+)( G[0-9]+)* ([A-Z]+[0-9]*[-[0-9]*[A-Z]*[0-9]*]*)/, "g");
                var verse = parsedBookJson["Ephesians"][i.toString()][j.toString()].replace(/ \{.*\} /,"").replace(/ \[/, "").replace(/\]/,"");//.split(" ");
                var results = [];
                var m = [];
                do {
                    m = re.exec(verse);
                    if (m) {
                        results.push(m);
                    }
                } while (m);
                parsedBookJson["Ephesians"][i.toString()][j.toString()] = [];
                for(var k = 0; k < results.length; k++){
                    //strongs is different because of a (possibly javascript itself?) bug
                    var temp = {"greek":results[k][1], "strongs":results[k][2], "morph":results[k][4]};
                    // console.log(verse);
                    // console.log("strongs", results[k][0].split(" ")[1]);
                    // console.log("results", results[0]);
                    parsedBookJson["Ephesians"][i.toString()][j.toString()].push(temp);
                }
            }
        }
        // console.log(parsedBookJson);
        return parsedBookJson;
    }


    return {

        bookNames: (function() {
            return bookNames;
        })(),

        //
        getBook: function(bookName) {
            return bible;
        },

        getChapters: function(bookName) {
            return getNumChapters(bookName);
        },

        getVerse: function(book, chapter, verse) {
            return getVerse(book, chapter, verse);
        },

        getChapter: function(book, chapter, verse){
            var numVerses = getNumVerses(book, chapter);
            var string = "";
            for(var i = 1, length = numVerses+1; i < length; i++){
                string += getVerse(book, chapter, i);
            }
            return {
                title: book,
                chapter: chapter,
                content: string
            };
        },

        getInfo: function(strongs) {
            return getDefinition(strongs);
        }

    };

}

exports.Book = Book;
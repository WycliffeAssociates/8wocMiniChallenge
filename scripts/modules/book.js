'use strict';

function Book() {
	var bible;
	var index = 0;
	init();
    
	function init(){
		parseJSON("lib/books/Ephesians.json");
		//bible = reconfigureBook(bible);
		//printVerse("Ephesians", "1", "2");
	}

	function getVerse(book, chapter, verse){
		if(typeof chapter === 'number'){
			chapter = chapter.toString();
		}
		if(typeof verse === 'number'){
			verse = verse.toString();
		}
		var string = "";
		for(var i =0; i < bible[book][chapter][verse].length; i++){
			var word = bible[book][chapter][verse][i];
			string += "<span data-strongs=\"" + word["strongs"] + "\" data-morph=\"" + word["morph"] + "\"\>" + word["greek"] + "\<\/span\>";
		}
		return string;
	}

	function parseJSON(jsonFile){
		// console.log(jsonFile);
		// var	xhttp = new XMLHttpRequest();
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
			success: function(json){
		  		console.log(json);
		  		bible = reconfigureBook(json);
		  	}
		});
	}

	function reconfigureBook(parsedBookJson){
		for(var i = 1; i < Object.keys(parsedBookJson["Ephesians"]).length + 1; i++){
				//console.log("hi " + Object.keys(parsedBookJson["Ephesians"][(i +1).toString()]).length);
			for(var j = 1; j < Object.keys(parsedBookJson["Ephesians"][i.toString()]).length + 1; j++){
				var re = new RegExp(/([α-ωΑ-Ω]+) (G[0-9]+)[ G[0-9]+]* ([A-Z]+[0-9]*[-[0-9]*[A-Z]*[0-9]*]*)/, "g");
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
					var temp = {"greek":results[k][1], "strongs":results[k][2], "morph":results[k][3]};
					parsedBookJson["Ephesians"][i.toString()][j.toString()].push(temp);
				}
			}
		}
		console.log(parsedBookJson);
		return parsedBookJson;
	}

}

exports.Book = Book;
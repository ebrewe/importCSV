/**
 * jQuery importCSV plugin v0.5
 *
 * Import CSV
 * author ericdbrewer@gmail.com
*/


(function() {

  (function($) {
    var methods, privateFunc;
    privateFunc = function() {
      return console.log("private");
    };
    methods = {
      init: function(options) {
        console.log('loading');
		 
		 var defaults = {
			'url'             : '',
			'language'        : 'EN',
			'callback'        : methods.printObject,
			'thClasses'       : '',
			'hideColumns'     : '',
			'theadClasses'    : '',
			'el'              : ''
		 }
        return this.each(function() {
          var $this, data;
          $this = $(this);
          var o = $.extend(defaults, options); 
		   o.el = $this; 
		   
		   //check for datatables
		   if( o.dataTables ){
		     if(typeof o.dataTables !== 'function'){
				console.log( 'dataTables must be a function');
				o.dataTables = false; 
			 };
		   }
		   
		   if( !o.url ){
		     return console.log('importCSV requires - interestingly enough -a CSV file to import.'); 
		   }
		   
		   //set hide on columns listed in hideColumns
		   if( o.hideColumns && typeof o.hideColumns == 'object' ){
			  for( var i = 0, k = o.hideColumns.length; i < k; i++){
				 o.thClasses[o.hideColumns[i]] += ' hide';  
			  }
		   }
		   methods.import(o.el, o.url, o.callback, o.thClasses, o.theadClasses, o.dataTables); 
        });
      },
	  
	  import: function(el, url, callback, thClasses, theadClasses, dataTables) {
		var myData;
		if (callback == null) {
		  callback = false;
		}
		myData = $.get(url);
		return myData.success(function(data) {
		  var myArr, myObj;
		  myArr = methods.csvToArray(data); 
		  myObj = methods.arrayToJson(myArr);
		  if (callback) {
			callback(el, myObj, thClasses, theadClasses);
			
			//TODO bind readmore/hide buttons
			
			if( dataTables ){
			  dataTables.apply()	
			}
		  }else{
			return 'successful';   
		  }
		});
	  },
	  
	  printObject: function(el, obj, thClasses, theadClasses){
		 //callback options - th classes
		 var columns = [],
		     markup = '';
		 
		 //if thClasses are set, loop through them and look for hides
		 //don't count hidden columns
		 if(thClasses){
			for( var i = 0, k= obj[1].length; i < k; i++){
			  if(thClasses[i]){
				  thClasses[i].replace(/undefined/g, '');
			  }
			  if( !(/hide/.test(thClasses[i])) ){
				columns.push(i);  
			  }
			}
		  } else {
			 for( var i = 0, k= obj[1].length; i < k; i++){
				columns.push(i); 
			 }
		  }
		 
		 //add the thead
		 markup += '<thead class="'; 
		 markup += (theadClasses.length > 1) ? theadClasses : '';
		 markup += '">';
		 for( var i in columns){
			markup +='<th'; 
			markup += ' class="'+obj[2][i];
			markup += thClasses[columns[i]] ? ' ' +thClasses[columns[i]] +'' : '';
			markup += '"';
			markup += '>' + obj[1][columns[i]] + '</th>'; 
		 }
		 markup += '</thead>';
		 
		 //add the columns
		 for(var i = 0, j= obj[0].length; i< j; i++){
			var thisRow = obj[0][i]; 
			markup += '<tr class="row-' + i + '">';
			for( var n in columns){
			  var theField = obj[2][columns[n]];
			  markup += '<td>';
			  markup += (thisRow[theField] && thisRow[theField].length > 50) ? methods.getExcerpt(thisRow[theField], 50, true) : thisRow[theField];
			  markup += '</td>';
			}
			markup += '</tr>'; 
		 }
		 
		 //add the tfoot
		 markup += '<tfoot>';
		 for( var i in columns){
			markup +='<th class="' + (thClasses[columns[i]]) + '">' + obj[1][columns[i]] + '</th>'; 
		 }
		 markup += '</tfoot>';
		 
		 //add the markup
		 $(el).append(markup);  
		 
		 //call plugins
		 
	  },
	  
	  arrayToJson:function(arr) {
		var dataOb, index, items, key, keys, the_title, thisItem, titles, untouchedTitles, val, _i, _j, _k, _len, _ref, _ref1;
		keys = arr[0];
		untouchedTitles = [];
		titles = [];
		items = [];
		for (val = _i = 0, _len = keys.length; _i < _len; val = ++_i) {
		  key = keys[val];
		  untouchedTitles.push(key);
		  the_title = key.replace(/[^\w\s]/gi, '');
		  the_title = the_title.replace(/\s/g, '_');
		  the_title = the_title.replace(/__/g, '_');
		  titles.push(the_title.toLowerCase());
		}
		for (key = _j = 1, _ref = arr.length; 1 <= _ref ? _j < _ref : _j > _ref; key = 1 <= _ref ? ++_j : --_j) {
		  if( arr[key].length == 1 && arr[key][0].length < 1)
		    continue
		  thisItem = arr[key];
		  dataOb = {};
		  for (index = _k = 0, _ref1 = thisItem.length; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; index = 0 <= _ref1 ? ++_k : --_k) {
			dataOb[titles[index]] = thisItem[index];
		  }
		  items.push(dataOb);
		}
		return [items, untouchedTitles, titles];
	  },

	  
	  getExcerpt: function(str, limit, readMore) {
		var cutTo, firstHalf, secondHalf, tempText;
		if (limit == null) {
		  limit = 100;
		}
		if (readMore == null) {
		  readMore = false;
		}
		tempText = str.substr(0, limit);
		cutTo = tempText.lastIndexOf(' ');
		if (limit > 30 && cutTo > (limit - 20)) {
		  firstHalf = str.substr(0, cutTo);
		  secondHalf = str.substr(cutTo + 1, str.length);
		  if (readMore) {
			firstHalf += ' <a href class="read-more">Read more...</a>';
		  }
		  return '<span class="excerpt">' + firstHalf + '</span><span class="remaining-text">' + secondHalf + '<a href class="hide-content hidden">Hide information</a></span>';
		}
		return '<span>' + str + '</span>';
	  },
	  
	  csvToArray: function( strData, strDelimiter ){
    	strDelimiter = (strDelimiter || ",");
    	var objPattern = new RegExp(
    		(
    			// Delimiters.
    			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    			// Quoted fields.
    			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    			// Standard fields.
    			"([^\"\\" + strDelimiter + "\\r\\n]*))"
    		),
    		"gi"
    		);
    	var arrData = [[]];
    	var arrMatches = null;
    	while (arrMatches = objPattern.exec( strData )){
    		var strMatchedDelimiter = arrMatches[ 1 ];
    		if (
    			strMatchedDelimiter.length &&
    			(strMatchedDelimiter != strDelimiter)
    			){
    			arrData.push( [] );

    		}
    		if (arrMatches[ 2 ]){
    			var strMatchedValue = arrMatches[ 2 ].replace(
    				new RegExp( "\"\"", "g" ),
    				"\""
    				);

    		} else {
    			var strMatchedValue = arrMatches[ 3 ];

    		}
    		arrData[ arrData.length - 1 ].push( strMatchedValue );
    	}
    	return( arrData );
    }

    };
    $.fn.importCSV = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("jQuery.importCSV: Method " + method + " does not exist on jQuery.importCSV");
      }
    };
  })(jQuery);

}).call(this);

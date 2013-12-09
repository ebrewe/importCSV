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
			'excerpts'        : 50,
			'el'              : '',
			'responsiveHide'  : '',
			'excerptCallback': methods.excerptCallback,
		 }
        return this.each(function() {
          var $this, data;
          $this = $(this);
          var o = $.extend(defaults, options); 
		   o.el = $this; 
		   
		   //turn hides into indexes
		   var hidesArr = []
		   for( var i in o.hideColumns){
		     var newIndex = o.hideColumns[i] - 1;
		     hidesArr[newIndex] = true; 
		   }
		   o.hideColumns = hidesArr;
		   
		   
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
		   
		   //set a minimum on excerpts
		   if( o.excerpts && o.excerpts < 40 ){
		     o.excerpts = 40; 
		   }
		   
		   methods.import(o); 
        });
      },
	  
	  import: function(o) {
		var el, url, callback, excerpts, thClasses, theadClasses, dataTables, rhide, ecallback, hides
		
		el = o.el;
		url = o.url;  
		callback = o.callback;
		excerpts = o.excerpts;
		thClasses = o.thClasses;
		theadClasses = o.theadClasses;
		dataTables = o.dataTables; 
		rhide = o.responsiveHide;
		ecallback = o.excerptCallback;
		hides = o.hideColumns; 
		
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
				callback(el, myObj, thClasses, theadClasses, excerpts, hides);
				
				
				//add responsive hides
				methods.addResponsiveHides(el, rhide); 
				
				//add th data-classes
				methods.addDataClasses(el, thClasses);
					
				if( dataTables ){			  
					dataTables.apply()	
				}
				
					
				//apply readmore callback
				if( excerpts ){
				 if( ecallback && typeof ecallback == 'function'){
					 ecallback(el);
				 }
				}
			  
		  }else{
			  return 'successful';   
		  }
		});
	  },
	  
	  printObject: function(el, obj, thClasses, theadClasses, excerpts, hides){
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
			  
			  if( !hides[i] ){
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
			markup += ' class="'+obj[2][i]+'" ';
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
			  console.log( excerpts )
			  markup += (thisRow[theField] && thisRow[theField].length > excerpts && excerpts) ? methods.getExcerpt(thisRow[theField], excerpts, true) : thisRow[theField];
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
	  
	  addDataClasses: function(el, classes){
	  
		  for( var i in classes ){
		    if( classes[i] && classes[i].length > 0 ){
		      var childNo = parseInt(i) + 1;
		      $(el).find('th:nth-child('+ childNo +') ').attr('data-class', classes[i]); 
		    }
		  }
	  },
	  
	  addResponsiveHides: function(el, hides){
			for( var i in hides){
			 if( hides[i] && hides[i].length > 0){
				var childNo = i + 1
				$(el).find('th:nth-child('+ childNo +') ').attr('data-hide', hides[i]);  
			 }
			}
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
    },
	
	excerptCallback: function(el){
		$(el).find('td').on('click', 'a.read-more, a.hide-content', function(e){
			e = e ? e : window.event;
			e.preventDefault();
			e.stopPropagation();
			$(this).closest('td').find('a.read-more, a.hide-content').toggleClass('hidden'); 
			$(this).closest('td').find('.remaining-text').fadeToggle();
			
		});
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

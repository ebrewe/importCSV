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
        		 
		 var defaults = {
			'url'             : '',
			'language'        : 'EN',
			'callback'        : methods.printObject,
			'thClasses'       : '',
			'hideColumns'     : '',
			'links'           : '',
			'mergeColumns'    : '',
			'theadClasses'    : '',
			'excerpts'        : 50,
			'links'           : [],
			'linkColumn'      : '',
			'el'              : '',
			'responsiveHide'  : '',
			'excerptCallback' : methods.excerptCallback,
			'debug'           : false
		 }
        return this.each(function() {
          var $this, data;
          $this = $(this);
          var o = $.extend(defaults, options); 
		   o.el = $this; 
		   
		   $(o.el).append('<div class="loading-div"></div>'); 
		   
		   //turn hides into indexes
		   var hidesArr = []
		   for( var i in o.hideColumns){
		     var newIndex = o.hideColumns[i] - 1;
		     hidesArr[newIndex] = true; 
		   }
		   o.hideColumns = hidesArr;
		   
		   //turn links into indexes
		   var linksArr = []
		   for( var i in o.links){
		     var newIndex = o.links[i] - 1;
		     linksArr[newIndex] = true; 
		   }
		   o.links = linksArr;
		   
		   if( o.links && !o.linkColumn){
			  console.log('links require a link column for reference');
			  o.links = undefined;    
		   }
		   
		   if( o.linkColumn ){
			 o.linkColumn -= 1;   
		   }
		   
		   //turn merges into array
		   o.mergeColumns = methods.mergeArray(o.mergeColumns);
		   
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
		var el, url, callback, excerpts, thClasses, theadClasses, dataTables, rhide, ecallback, hides, merges, links, linkCol
		
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
		merges = o.mergeColumns;
		links = o.links;
		linkCol = o.linkColumn; 
		
		var myData;
		if (callback == null) {
		  callback = false;
		}
		myData = $.get(url);
		return myData.success(function(data) {
		  var myArr, myObj;
		  myArr = methods.csvToArray(data); 
		  myObj = methods.arrayToJson(myArr);
		  
		  if(o.debug)
		    console.log( myObj );
		  
		  if (callback) {
				callback(el, myObj, {'thClasses':thClasses, 'theadClasses':theadClasses, 'excerpts':excerpts, 'hides':hides, 'merges':merges, 'links':links, 'linkCol':linkCol});
				
				
				//add responsive hides
				methods.addResponsiveHides(el, rhide); 
				
				//add th data-classes
				methods.addDataClasses(el, thClasses);
				
				//add excerpts
				methods.addExcerpts(el, excerpts); 
					
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
	  /*==================================
	  **
	  ** main Parsing Callback
	  **
	  ==================================*/
	  printObject: function(el, obj, opts){
		 //callback options - th classes
		 var useCols = [],
		     mergedCols = [],
			 changedTitles = [],
		     markup = '',
			 titles = obj['titles'],
			 ptitles = obj['preformTitles'],
			 data = obj['data'];
			 
		var thClasses, theadClasses, excerpts, hides, merges, links, linkCol
	    thClasses = opts.thClasses ? opts.thClasses : 0;
		 theadClasses = opts.theadClasses ? opts.theadClasses : 0;
		 excerpts = opts.excerpts ? opts.excerpts : 0;
		 hides = opts.hides ? opts.hides : 0;
		 merges = opts.merges ? opts.merges: 0;
		 links = opts.links ? opts.links : 0;
		 linkCol = opts.linkCol ? opts.linkCol : 0;
		 
		 //create list of columns to ignore because of mergers
		 for( var column in merges ){
		   if( typeof merges[column] == 'object'){
			  for( var i in merges[column] )
				mergedCols[merges[column][i] ] = column
		   }else{
			  mergedCols[merges[column]] = column   
		   }
		 };
		 //loop through items
		 for( var column in titles ){
			 //set usable columns, discard hides
			if( !hides[column])
			  useCols.push( column )	
		 } 
		 
		 //parse the data, populate the table 
		 markup += '<thead class="'; 
		 markup += (theadClasses.length > 1) ? theadClasses : '';
		 markup += '">';
		 markup += '<tr>';
		 //headings		 
		 for( var column in titles ){
			//console.log( (mergedCols[column]) ? titles[column] + ' is merged with ' + mergedCols[column] : titles[column] ) 
			if( !mergedCols[column] && !hides[column] ){
			  markup += '<th class="col-'+titles[column]+'">';
			  markup += (changedTitles[column]) ? changedTitles[column] : ptitles[column];
			  markup += '</th>';	
			}
		 }
		 markup += '</tr></thead>';
		 
		 //tbody content
		 for( var row = 0, data_len = data.length; row < data_len; row ++){
			 var rowNum = parseInt(row) + 1;
			 markup += '<tr class="row-' + rowNum + '">';
			 for( var column in titles ){
				if( !hides[column] && !mergedCols[column]) {
				  
				  //add cell data
				  markup += '<td>' 
				  
				  //look for links
				  if(links){
					  if( links[column]){
						markup += '<a href="'+ data[row][titles[linkCol]] + '">'
					  }
				  }
				  markup += data[row][titles[column]] 
				  
					//close possible links
				  if(links){ 
				    if( links[column])
					  markup += '</a>'
				  }
				  //include merged data
				  if( merges[column] ){
					//if multi merge
					if( typeof merges[column] == 'object'){
					  for( var _col in merges[column]){
						 //add the merged title as a class, add the merged data
					    markup += '<span class="merged-col-' + titles[merges[column][_col]] +'">' + data[row][titles[merges[column][_col]]] +'</span>'; 
					  }
				    }else{
					  //add the merged title as a class, add the merged data
					  markup += '<span class="merged-col-' + titles[merges[column]] +'">' + data[row][titles[merges[column]]] +'</span>'; 
				    }
				  }
				  
				  //close cell
				  markup += '</td>';	
				}
			 }
			 markup += '</tr>'; 
		 }
		 //tfoot
		 markup += '<tfoot>';
		 for( var column in titles ){
			if( !mergedCols[column] && !hides[column] ){
			  markup += '<th class="col-'+titles[column]+'">';
			  markup += (changedTitles[column]) ? changedTitles[column] : ptitles[column];
			  markup += '</th>';	
			}
		 }
		 markup += '</tfoot>';
		 
		 //remove loading div
		 if( $(el).find('.loading-div').length > 0)
		   $(el).find('.loading-div').remove(); 
		   
		 //append markup
		 $(el).append(markup); 
		 
		 
	  },
	  
	  addDataClasses: function(el, classes){
	  
		  for( var i in classes ){
		    if( classes[i] && classes[i].length > 0 ){
		      var childNo = parseInt(i) + 1;
		      $(el).find('th:nth-child('+ childNo +') ').attr('data-class', classes[i]); 
		    }
		  }
	  },
	  
	  addExcerpts: function(el, excerpts){
		  $(el).find('td').each( function(){
			  //IF NO LINK IN THE CELL
			  
			 if( $(this).find('a').length < 1)
			   $(this).html( methods.getExcerpt($(this).text(), excerpts, true) );
		  });
	  },
	  
	  mergeArray: function( arr){
		  var mergeList = []
		  for( var i = 0, j = arr.length; i < j; i++){				 
		    var index = parseInt(arr[i][0]) - 1;
		    var val = arr[i][1] ;

			 if( typeof val == 'object' ){
			    for( var n in val){
				  val[n] = parseInt( val[n]) - 1;	
				}
				mergeList[index] = val;
			 }else{
				 mergeList[index] = parseInt(val) - 1;
			 }
		  }
		  return mergeList; 
	  },
	  
	  addResponsiveHides: function(el, hides){
			for( var i in hides){
			 if( hides[i] && hides[i].length > 0){
				var childNo = parseInt(i) + 1
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
		
		return {'data':items, 'preformTitles':untouchedTitles, 'titles':titles};
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

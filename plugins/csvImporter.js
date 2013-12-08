//Convert to array
function CSVToArray(e,t){t=t||",";var n=new RegExp("(\\"+t+"|\\r?\\n|\\r|^)"+'(?:"([^"]*(?:""[^"]*)*)"|'+'([^"\\'+t+"\\r\\n]*))","gi");var r=[[]];var i=null;while(i=n.exec(e)){var s=i[1];if(s.length&&s!=t){r.push([])}if(i[2]){var o=i[2].replace(new RegExp('""',"g"),'"')}else{var o=i[3]}r[r.length-1].push(o)}return r}

(function() {
  var ArrayToJson, getCsv, printObject, theExcerpt;

  getCsv = function(url, callback) {
    var myData;
    if (callback == null) {
      callback = false;
    }
    myData = $.get(url);
    return myData.success(function(data) {
      var myArr, myObj;
      myArr = methods.CSVToArray(data);
      myObj = methods.ArrayToJson(myArr);
      if (callback) {
        return callback(myObj, '.animals');
      }
    });
  };

  ArrayToJson = function(arr) {
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
      titles.push(the_title);
    }
    for (key = _j = 1, _ref = arr.length; 1 <= _ref ? _j < _ref : _j > _ref; key = 1 <= _ref ? ++_j : --_j) {
      thisItem = arr[key];
      dataOb = {};
      for (index = _k = 0, _ref1 = thisItem.length; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; index = 0 <= _ref1 ? ++_k : --_k) {
        dataOb[titles[index]] = thisItem[index];
      }
      items.push(dataOb);
    }
    return [items, untouchedTitles];
  };

  printObject = function(obj, elem) {
    var animal, animals, columns, _i, _len;
    if (elem == null) {
      elem = '.animals';
    }
    animals = obj[0];
    columns = obj[1];
    $(elem).append('<thead><tr><th>Resource Title/ Author</th>' + '<th>Species Name</th>' + '<th>Sector</th>' + '<th>Regulation</th>' + '<th>Activity</th>' + '<th>Species Group</th></tr></thead>');
    for (_i = 0, _len = animals.length; _i < _len; _i++) {
      animal = animals[_i];
      if (animal.Species__Common_Name && animal.Species__Common_Name.length <= 50) {
        $(elem).append('<tr>' + '<td><a href>' + animal.Species__Common_Name + '</a>' + animal.Author + '</td>' + '<td>' + animal.Species__Common_Name + '<br>' + animal.Species__Scientific_Name + '</td>' + '<td>' + theExcerpt(animal.Sector, 50) + '</td>' + '<td>' + theExcerpt(animal.Regulation, 50) + '</td>' + '<td>' + theExcerpt(animal.Activity, 50, true) + '</td>' + '<td>' + animal.Taxanomic_Group + '</td>' + '</tr>');
      }
    } 
	$(elem).append('<tfoot><tr><th>Resource Title/ Author</th>' + '<th>Species Name</th>' + '<th>Sector</th>' + '<th>Regulation</th>' + '<th>Activity</th>' + '<th>Species Group</th></tr></tfoot>');
    $(elem).append('</tbody>');
	Plugins.init(); // Init all plugins
  };

  theExcerpt = function(str, limit, readMore) {
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
  };

  jQuery(function($) {
    var resource;
    resource = 'ENGLISH TagsForRefToolbox_RealData_20130625.csv';
	
	$('.animals').on('click', 'a.read-more, a.hide-content', function(e){
		e = e ? e : window.event;
		e.preventDefault();
		e.stopPropagation(); 
		$(this).closest('td').find('.read-more, .hide-content').toggleClass('hidden');
		$(this).closest('td').find('.remaining-text').toggleClass('visible').fadeToggle();
	});
    return getCsv(resource, printObject);
  });

}).call(this);

# importCSV.js

Takes a CSV file and parses it into a data object.

Given:

    <table id="myTable">
    
    </table>

Call:

		$('#myTable').importCSV({
			url               : 'path/to/myCsv.csv',
			language          : *not implemented*,
			callback          : (function(){..}),
			hideColumns       : [1,2,5],
			thClasses         : ['expand', '', '', 'expand'],
			theadClasses      : 'class1 class2 class3',
			responsiveHide    : ['phone tablet', '', 'phone'],
			excerpts          : 100,
			excerptCallback   : (function(){...})
		});
  
  
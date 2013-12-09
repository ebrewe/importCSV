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
  

## Available options

### url

The url for the csv, a local file.

### callback

Defaults to the table-populating function.
You can provide your own callback to deal with the data if you like. Callbacks are implemented as 

    callback(el, myObj, thClasses, theadClasses, excerpts, hides);
    
The myObj is an array returned from the JSON parser and is modeled as

    [0] -> the data in each of the columns
    [1] -> the preformatted names of the columns
    [2] -> the names of the columns to lowercase with no spaces
    
### hideColumns

The column numbers from the CSV that you don't want in the table. To exclude the first, second and fifth columns from the table, provide:

    [1,2,5]

### thClasses

A list of classes that will be added to the table's th tags in the **data-class** attribute.  






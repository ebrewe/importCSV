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
			dataTables        : (function(){..}),
			hideColumns       : [1,2,5],
			mergeColumns      : [ [1,2], [12, [14, 12]] ],
			links             : [1,2],
			linkColumn        : [1],
			thClasses         : ['expand', '', '', 'expand'],
			theadClasses      : 'class1 class2 class3',
			responsiveHide    : ['phone tablet', '', 'phone'],
			changeTitles      : ['new title', 'new title 2'],
			excerpts          : 100,
			excerptCallback   : (function(){...})
		});
  

## Available options

### url

The url for the csv, a local file.

### callback

Defaults to the table-populating function.
You can provide your own callback to deal with the data if you like. Callbacks are implemented as 

    callback(el, myObj, options);
    
The myObj is an array returned from the JSON parser and is modeled as

    [data]         -> the data in each of the columns
    [peformTitles] -> the preformatted names of the columns
    [titles]       -> the names of the columns to lowercase with no spaces
    
### dataTables

If you're using dataTables plugin, put the initiating function call here.  Current implementation suggests always using:

    dataTables : (function(){Plugins.init()})
    
### hideColumns

The column numbers from the CSV that you don't want in the table. To exclude the first, second and fifth columns from the table, provide:

    [1,2,5]
	
### mergeColumns

Specify - before the table populates - which columns to merge.  Accepts an **array** in the form of

    mergeColumns: [ [ column to merge into, column to merge], ... ]

or

    mergeColumns: [ [column to merge into, [column to merge, column to merge] ], ... ]
	
As you can see, the second element of the array can also be an array if you want to merge several columns into another column.

### links

Specify - before the table populates - if there are any columns you wish to be links to outside resources. Currently, for this to work, you must indicate a **linkColumn** elsewhere on the CSV that contains the link address you will use for the cell.

### linkColumn

As stated above, the column of the CSV that contains a link.  I suppose in the next iteration, links should be supplied as [linking column, source] where source can be a given link or a related CSV cell. 

### thClasses

A list of classes that will be added to the table's th tags in the **data-class** attribute.  

### theadClasses

Adds a class or classes to the **thead** element. If you go for that sort of thing.

### responsiveHide

Provide a list of rules that will be added to the **data-hide** attribute of each column. 

### changeTitles

Provide new titles to each column in order. Useful if you merged two columns and want to change the column to reflect this. For example, your CSV has the columns 

    | Name | Number | Address | City | Email | 
	
and you want to combine Address and City:

    mergeColumns: [[3, 4]],
	changeTitles: ['','', 'Address/City']


### excerpts

Use if you want to abbreviate the data or set to false.  Pass a number of characters (minimum of 40) and the data returned will be split into two sections with show and hide **anchor** tags. Perfectly acceptable to set false and apply your own abbreviating script later.  Whatever floats your boat. 

### excerptCallback

If you use the excerpt, you have the option of using the predefined excerpt function with a standard show/hide for added data or you can provide your own function to use. It's just jQuery DOM stuff. Look at the markup and do what you want.








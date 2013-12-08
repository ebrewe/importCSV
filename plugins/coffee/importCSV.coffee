###*
 * jQuery importCSV plugin v0.5
 *
 * Import CSV
 * author ericdbrewer@gmail.com
###
 
(($) ->
    defaults = 
      url     : '',
      language: 'EN'

	# Private functions 
	privateFunc = () ->
		console.log "private"
	
	# Public Functions
	methods = 
		init: (options) ->
			#console.log 'init'
			@each ->
				$this = $(@)
				opts = $.extend {},defaults,options
				
				console.log opts
				data = $this.data 'importCSV'
				if not data
					### Do more stuff here ###
					$(@).data 'importCSV' 
						target: $this
				return
		
		destroy: () ->
			@each ->
				$this = $(@)
				data = $this.data 'importCSV'
				
				data.importCSV.remove()
				$this.removeData 'importCSV'
				return
 
	$.fn.importCSV = (method) ->
		
		# Method calling logic
		if methods[method]
			methods[method].apply this, Array.prototype.slice.call arguments, 1 
		else if typeof method is 'object' or !method 
			methods.init.apply this, arguments
		else
			$.error "jQuery.importCSV: Method #{ method } does not exist on jQuery.importCSV"
	return
)(jQuery)
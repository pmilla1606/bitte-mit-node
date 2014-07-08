var SpotifySearch = Backbone.View.extend({
	el: '.searchWrap',
	events:{
		
		'click #searchToggle': 'openSearch',
		'click #closeSearch': 'closeMe',
		
		// think about this -- keyup, click, etc etc
	},
	template: _.template($('#temp_spotify_search').html()),
	initialize:function(){

		this.render();
	},
	render: function(){
		
		return this.$el.html(this.template()).addClass('active animated rubberBand bounceInUp');
	},
	openSearch: function(e){
		e.preventDefault();
		var that = this;
		if(this.$el.hasClass('searching')){
			this.$el.removeClass('searching');
		}
		else{
			this.$el.addClass('searching');
			that.queryMe();
		}
		
		
		

	},
	queryMe: function(e){
		// SEARCH SEARCH SEARCH //
		// empty console.log for browsers lacking
		if (!window.console) window.console={log:function(){}};
		
		// should we persist search query and region in local storage?
		var HAS_LOCAL_STORAGE = (typeof localStorage === 'object');
		
		// tracks changes to form inputs in real time
		function InputChangeTracker($input, validatorFilter, handler, persistKey, paused) {
		  this.$input = $input;
		  var old_value = 0;
		  $input.change(function() {
		    if (persistKey) localStorage[persistKey] = this.value;
		    var current_value = $.trim(this.value);
		    if (validatorFilter) validatorFilter(current_value);
		    if (old_value && current_value && current_value != old_value) {
		      handler.replacedValid(old_value, current_value);
		    } else if (!old_value && current_value) {
		      handler.becameValid(old_value, current_value);
		    } else if (old_value && !current_value) {
		      handler.resignedValid(old_value, current_value);
		    }
		    old_value = current_value;
		  });
		  // record value
		  this._input = $input[0];
		  this._value = $.trim(this._input.value);
		  // resume unless paused
		  if (!paused)
		    this.resume();
		  // load persisted value
		  if (persistKey && HAS_LOCAL_STORAGE && String($input[0].value).length == 0) {
		    var value = localStorage[persistKey];
		    if (value) $input[0].value = value;
		  } else persistKey = null;
		}
		
		InputChangeTracker.prototype.resume = function(frequency) {
		  clearInterval(this.timer);
		  frequency = parseInt(frequency);
		  var self = this;
		  this.timer = setInterval(function() {
		    if (self._value != (self._value = $.trim(self._input.value))) {
		      self.$input.change();
		    }
		  }, (frequency > 0 && !isNaN(frequency)) ? frequency : 100);
		};
		
		InputChangeTracker.prototype.pause = function() {
		  clearInterval(this.timer);
		  this.timer = null;
		};
		
		
		var spotifyMDQuery = {
		  $view: null, $input: null,
		  
		  enable: function() {
		    var self = this;
		   	

		      self.$input[0].disabled = false;
		      self.changeTracker.resume();
		    
		    this.searchResults.$view = this.$view.find('#spSearchResults');
		    // setup region
		    if (!this._hasSetupRegion) {
		      // set region from stored data, if any
		      
		      regionCode = 'US';
		      this._hasSetupRegion = true;
		    }
		  },
		  
		  disable: function() {
		   
		    this.$input[0].disabled = true;
		    this.changeTracker.pause();
		  },
		  
		  searchResults: {
		    $view: null,
		    update: function (data) {
		      if (data) this.data = data;
		      else data = this.data;
		      if (!data) return;
		      var $count = this.$view.find('.count');
		      var $list = this.$view.find('#spSearchResults');
		      

		      $count.text(data.info.num_results);
		      $list.empty();
		      var A = function(href, text, styleClass) {
		        var a = document.createElement('a');
		        a.setAttribute('href', href);
		        if (styleClass)
		          a.setAttribute('class', styleClass);
		        if (text) a.appendChild(document.createTextNode(text));
		        return a
		      }
		      var i, L, li, $li, a, x, artist, track, limit = 30;
		      for (i=0,L=data.tracks.length; i<L; ++i) {
		        track = data.tracks[i];
		        
		        // check region
		        if (track.album && track.album.availability && spotifyMDQuery.regionCode) {
		          if (track.album.availability.territories.indexOf(spotifyMDQuery.regionCode) === -1) {
		            // not available
		            continue;
		          }
		        }
		        
		        var searchResultListingTemplate = _.template($('#temp_track_search_result').html());
		        
		        

		        $('#spSearchResults').html('');
				for (var i = 0; i<data.tracks.length; i++){
					
					$('#spSearchResults').append(searchResultListingTemplate({
						'track_artist': data.tracks[i].artists[0].name,
						'track_name': data.tracks[i].name,
						'added_by': localStorage.getItem('userName')
					}));
				}

		

		
		        if (--limit === 0) {
		          
		          break;
		        }
		      }
		    
		    $('.progress-button').on('click', function(){
		    	var that = this;
		  		var thisUri = $(this).data('spouri');
				var partyName = Date.now();
				var thisTrack = $(this).find('.trackName').html();
				var thisArtist = $(this).find('.trackArtist').html();
				
				

				
				$.ajax({
						url: "http://www.bitte.io/sahne/addTrack.php",
						data: {	'party_name':JSON.stringify(partyName),
								'uri':JSON.stringify(thisUri),
								'track_name': JSON.stringify(thisTrack),
								'track_artist':JSON.stringify(thisArtist)
								},
						type: 'POST',
						beforeSend: function(){
							$(that).find('.buttonLoader').fadeIn();
						},
						success: function() {
								$(that).fadeOut();
								
						}
				});
		  		
		  	});  
		    },
		    
		    clear: function () {
		      this.$view.find('.list').empty();
		    }
		    
		    
		  },
		  
		  sendQuery: function (query) {
		    var self = this;
		    if (self._activeQueryXHR)
		      self._activeQueryXHR.abort();
		    $.ajax({
		      url: 'http://ws.spotify.com/search/1/track.json',
		      dataType: 'json',
		      data: {q: query},
		      timeout: 30000,
		      beforeSend: function (xhr) {
		        self._activeQueryXHR = xhr;
		      },
		      complete: function (xhr, textStatus) {
		        if (self._activeQueryXHR === xhr)
		          self._activeQueryXHR = null;
		      },
		      success: function (data, textStatus, xhr) {
		        //console.log('results: ', data, textStatus, xhr);
		        self.searchResults.update(data);
		      }
		    });
		  },
		  
		  dispatchSendQuery: function (query) {
		    if (!this._sendQueryLatency) {
		      // no latency first time
		      this.sendQuery(query);
		      this._sendQueryLatency = 100;
		      return;
		    } else {
		      this._sendQueryLatency = Math.min(this._sendQueryLatency + 100, 600);
		    }
		    if (this._sendQueryTimer) clearInterval(this._sendQueryTimer);
		    var self = this;
		    this._sendQueryTimer = setTimeout(function(){
		      self._sendQueryTimer = null;
		      self._sendQueryLatency = 100;
		      self.sendQuery(query);
		    }, this._sendQueryLatency);
		  },
		  
		  // --- change handlers ---
		  
		  // still valid but id changed
		  replacedValid: function (oldValue, value) {
		    console.log('query changed: still valid but id changed', 
		                oldValue, '-->', value)
		    this.dispatchSendQuery(value);
		  },
		  
		  // changed from invalid to valid
		  becameValid: function (oldValue, value) {
		    console.log('query changed: became valid id', value)
		    this.searchResults.$view.fadeIn(200);
		    this.dispatchSendQuery(value);
		  },
		  
		  // changed from valid to invalid
		  resignedValid: function (oldValue, value) {
		    console.log('query changed: resigned valid id (was '+oldValue+')')
		    var searchResults = this.searchResults;
		    searchResults.$view.fadeOut(200, function() {
		      searchResults.clear();
		    });
		  }
		};





		  spotifyMDQuery.$view = $('#spSearchView');
		  spotifyMDQuery.$input = spotifyMDQuery.$view.find('#spotifySearchInput');
		  spotifyMDQuery.changeTracker = new InputChangeTracker(spotifyMDQuery.$input, null, spotifyMDQuery, 'spotifyMDQuery');
		  spotifyMDQuery.$region = spotifyMDQuery.$view.find('select.region');
		  spotifyMDQuery.enable();
		  spotifyMDQuery.$input.focus(); 
			
	},
	destroyMe: function(){

	}
});




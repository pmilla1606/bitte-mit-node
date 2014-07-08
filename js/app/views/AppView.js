var currentDeck = new TrackCollection();
var AppView = Backbone.View.extend({

	initialize:function(){
		var that = this;
		
		
		// fetch data from server and start main render on success
		// uncomment this when testing on server XXXXXXX
		  // currentDeck.fetch({
		  // 	success:function(data){
		 		
		  // 		that.render();
		  // 	},
		  // 	error:function(){
		  // 		console.log('there was an error somewhere...');
		  // 	}
		  // });

		// ok, a few things need to happen here:
		// 1) init the localStorage and associated logic
		// 2) set up a username for the user -- if no name was given, assign something like 'anon123'
		// 3) fire the main render function when all of that is done


		var socket = io('http://localhost:1337/');
		  socket.on('dummy', function (data) {
		    //console.log(data);
		    // _.each(data, function(track){
		    // 	console.log(track);
		    // 	currentDeck.set(track);
		    // });
		  		console.log('');
		  		console.log('');
		  	_.each(data, function(test){
		  		console.log('name -->', test.track_name);
		  		console.log('position', test.position);

		  	});
		  	console.log('on dummy', data)

		  	currentDeck.set(data);
		  	currentDeck.trigger('change:position');
		  	if(currentDeck.length < 15){
			
				var SpottySearch = new SpotifySearch();
			}
		  	//currentDeck.trigger('change:position');
		  
		  });

		  
		  

		var maxVotes = 3;
		if(!localStorage.getItem('userVotes')){
			localStorage.setItem('userVotes', 3);
		}
		
		
		this.render();
		// comment out this when testing on server XXXXXXX
		
	},
	render:function(){
		// DEBUG SHITE HERE
			var socket = io('http://localhost:1337/');
			$('#addSong').on('click', function(){
				socket.emit('debugAddSong');
			});

			$('#removeSong').on('click', function(){
				socket.emit('debugRemoveSong');
			});

			$('#clearLS').on('click', function(){
				localStorage.setItem('userVotes', 10);
			});
        
		// END DEUBG SHITE
		var loginView = new LoginView();
	}
});
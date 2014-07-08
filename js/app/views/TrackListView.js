var TrackListView = Backbone.View.extend({
	el: '.tracksWrapper',
	events:{

	},
	initialize: function(){
			this.render();
			//currentDeck.on('add', this.render, this);
			currentDeck.on('change:position', this.render, this);
	},
	render:function(){
		console.log('render');
		var that = this;
		currentDeck.sort();
		
		this.$el.html('');
		
		
		currentDeck.forEach(function(track){
			//console.log(track);
			// decide whether or not the song is the one currently playing

			if(track.get('is_current')===1){
				var currentTrackView = new CurrentTrackView({model:track});
				that.$el.prepend(currentTrackView.render());

			}
			else{
				var trackView = new TrackView({model:track});
				that.$el.append(trackView.render());
				
			}
		});
		

		
	

	}
});
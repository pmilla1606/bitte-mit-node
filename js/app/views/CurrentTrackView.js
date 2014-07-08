var CurrentTrackView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#temp_current_track').html()),
	events:{

	},
	initialize: function(){
		// what do we do here?
		//this.render();
	}, 
	render: function(){
		return this.$el.html(this.template(this.model.toJSON()));
		
	}	
});
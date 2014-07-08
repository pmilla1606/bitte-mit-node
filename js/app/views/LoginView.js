var LoginView = Backbone.View.extend({
	el: 'section#login',
	events:{
		'click #loginSubmit':'login'
	},
	initialize:function(){
		$('#spinWrap').fadeOut();
		if(localStorage.getItem('userName')){
			this.renderTracks();
		}

	},
	login:function(){
		var userNameInput = this.$el.find('#username');
		
		if(!userNameInput == ''){
			localStorage.setItem('userName', userNameInput.val());	
		}
		else{
			localStorage.setItem('userName', 'Anon'+Date.now());
		}

		this.renderTracks();
		
	},
	renderTracks: function(){
		var trackList = new TrackListView();
		
		// I don't like this at all. Figure out a way to properly do page/section transitions - PM 26.6.14
		this.$el.removeClass('active');
		$('body').find('section#tracks').addClass('active');

	}

});




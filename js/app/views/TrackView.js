var TrackView = Backbone.View.extend({
	tagName:'li',
	attributes: function(){
		return {
			'data-track-id': this.model.get('position')
		};
	},
	template: _.template($('#temp_track').html()),
	events: {
         		 'touchstart .upVote' 		: 'voteNote',
         		 'touchstart .downVote' 	: 'voteNote',
         		 'touchend .upVote' 		: 'upVoteMe',
         		 'touchend .downVote'		: 'downVoteMe',
         		//'touchmove':'touchHandler'


     },
 	initialize: function(){
		this.on('all', function(eventName){
	            console.log('TrackView init: ' + eventName);
	        });
	},
	render: function(){
		return this.$el.html(this.template(this.model.toJSON()));
	},
	voteNotifier:function(e){

	},
	touchHandler:function(e){
		console.log(e)
	},
	
	voteNote: function(e){
		var that = this;
		var voteNoteTemp = _.template($('#temp_vote_note').html());
		var target = $(e.currentTarget);

		if(localStorage.getItem('userVotes')==0){
			this.$el.append(voteNoteTemp({
				votes_remaining: 0,
				direction:'error'
			}));
			this.$el.addClass('animated shake');
			this.$el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e) {
				that.$el.removeClass('animated shake');
			});
			return false;
		}

		if (target.hasClass('upVote')){
			this.$el.append(voteNoteTemp({
				votes_remaining: Number(localStorage.getItem('userVotes')-1),
				direction: 'up'
			}));
		}else
		{
			this.$el.append(voteNoteTemp({
				votes_remaining: Number(localStorage.getItem('userVotes')-1),
				direction: 'down'
			}));
		}
	},
	upVoteMe: function(e){
		e.preventDefault();
		var that = this;
		var socket = io('http://localhost:1337/');
		
		var myIndex = that.model.collection.indexOf(that.model);
		var prevModel = that.model.collection.at(myIndex - 1);
		var prevPrevModel = that.model.collection.at(myIndex -2);
		
		var currentVotes = localStorage.getItem('userVotes');
		var newVoteCount = Number(currentVotes-1);

		that.$el.find('.voteNote').remove();
		
		if(localStorage.getItem('userVotes')==0){
			return false;
		}

		if(prevPrevModel){
			
			localStorage.setItem('userVotes', newVoteCount);
			that.$el.addClass('flipFlopBottom');
			that.$el.prev('li').addClass('flipFlopTop').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e) {
				
				that.$el.removeClass('flipFlopBottom');
				that.$el.prev('li').removeClass('flipFlopTop');
				
			});

			var voteBundle = {
			'voted': {
			    'track_id': that.model.get('track_id'),
			    'position': that.model.get('position'),
			    
			  },
			'other':{
			  	'track_id': prevModel.get('track_id'),
			  	'position': prevModel.get('position')
			  }
			};

			socket.emit('upvote', voteBundle) 
				
		}
	},
	downVoteMe: function(e){
		e.preventDefault();
		var that = this;
		var socket = io('http://localhost:1337/');
		
		var myIndex = that.model.collection.indexOf(that.model);
		var nextModel = that.model.collection.at(myIndex + 1);
		var nextNextModel = that.model.collection.at(myIndex +2);
		
		var currentVotes = localStorage.getItem('userVotes');
		var newVoteCount = Number(currentVotes-1);

		that.$el.find('.voteNote').remove();
		
		if(localStorage.getItem('userVotes')==0){
			return false;
		}

		if(nextNextModel){
			
			localStorage.setItem('userVotes', newVoteCount);
			that.$el.addClass('flipFlopBottom');
			that.$el.next('li').addClass('flipFlopTop').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e) {
				
				that.$el.removeClass('flipFlopBottom');
				that.$el.next('li').removeClass('flipFlopTop');
				
			});

			var voteBundle = {
			'voted': {
			    'track_id': that.model.get('track_id'),
			    'position': that.model.get('position'),
			    
			  },
			'other':{
			  	'track_id': nextModel.get('track_id'),
			  	'position': nextModel.get('position')
			  }
			};

			socket.emit('downvote', voteBundle) 
				
		}
	}
});
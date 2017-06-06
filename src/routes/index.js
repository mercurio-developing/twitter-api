'use strict';

var express = require('express');//express module
var router = express.Router(); //router is the function express router
var Twit = require('twit'); // tweeter module
var config = require('../config.js'); // token of tweeter api

var T = new Twit(config); // I create a new variable with keys in the module config

	router.get('/', function(req, res) { //when the route is in "/" the program calls for different data

			const userProfile =	T.get('account/verify_credentials', { }, function(err, data, response) {
							});
			const userTweets = T.get('statuses/home_timeline', {count: 5}, function(err, data, response) {
							});
			const userMsgSent =	T.get('direct_messages/sent', { count: 5}, function(err, data, response) {
							});
			const fiveLastFriends =	T.get('friends/list', { count: 5}, function(err, data, response) {
			});

			const arrayOfPromises = [userProfile,userTweets,userMsgSent,fiveLastFriends]; // I create the promise, then  I wait for all data responses 
			Promise.all(arrayOfPromises).then(function(arrayOfResults) {			
																																									//i can render all togheter

			let userName = arrayOfResults[0].data.screen_name;			//in the last step I set variables with the values in the data
			let url = arrayOfResults[0].data.profile_image_url;
			let banner = arrayOfResults[0].data.profile_banner_url;
			let followers = arrayOfResults[0].data.followers_count;


			let tweets = arrayOfResults[1].data;   // I set the variable tweets with value of tweets data
			let tweetsData = []; //I create the array of tweets

			tweets.forEach((value, key ,array) => { //I create one array with all tweets inside with the different values
				tweetsData.push({
					tweetScreenName : value.user.screen_name,
					tweetUserName : value.user.name,
					tweetImg : value.user.profile_image_url,
					text : value.text,
					favorite : value.favorite_count,
					dateTweet : value.created_at.substring(3, 16),
					retweet : value.retweet_count,
					});
				});

				let messages = arrayOfResults[2].data; //I set message in the variable with the route data of messages

				let friends = arrayOfResults[3].data.users; //I set variable friends with the route data of friends


			res.render('index', {  //I render index
				userName : userName,
				url : url,
				banner : banner,
				followers : followers,
				tweetsData : tweetsData,
				friends : friends,
				messages : messages
			});

		}).catch( (err) => { //if promise fail i send the message error
    let error = new Error('the Promise is break!');
    res.send(error);
  });
	});

	router.post('/send', function(req, res) { //the submit changes the route to /send
		let update = req.body.message; //I request for the body in message and set this in update
		T.post('statuses/update', { status: update }, function(err, data, response) {//
	});
			setTimeout(() => { //I give a delay to refresh status.
				res.redirect('/');
		  }, 450);
	});


module.exports = router;//I export router module

const request = require('request');
const config = require('../config');

exports.getContent = (keyword, cb) => {
	let response="";
	request({
		uri: config.PROTOCOL + config.HOST + config.SEARCH_URI,
		qs: {
			start: 0,
			query: keyword
		}
	}, (error, response, body) => {
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content)
			
			response = content.hasOwnProperty('weather') ? `The current weather for ${geocity} is ${weather['main'].temp} degress with ${weather['weather'][0]['description']}` :
															'No appropriate weather details found'

			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}
const request = require('request');
const config = require('../config');

exports.getContent = (keyword, cb) => {
	console.log('keyword:'+keyword);
	let path = config.PROTOCOL + config.HOST + config.SEARCH_URI;
	console.log('URI: '+path)
	let response="";
	request({
		uri: path,
		qs: {
			start: 0,
			query: keyword
		},
		headers: {
			'Authorization': config.AUTH_HEADER + config.AUTH_TOKEN;
		}
	}, (error, response, body) => {
		
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`MESSAGE: ${res.statusMessage}`);
		console.log('Response Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
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

exports.getToken() {
    return config.AUTH_HEADER + config.AUTH_TOKEN;
  }
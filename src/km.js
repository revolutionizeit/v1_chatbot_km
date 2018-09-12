const request = require('request');
const config = require('../config');

exports.getContent = (keyword, cb) => {
	//console.log('keyword:'+keyword);
	//let path = config.PROTOCOL + config.HOST + config.SEARCH_URI;
	//console.log('URI: '+path)
	let response="";
	request({
		uri: config.PROTOCOL + config.HOST + config.SEARCH_URI,
		qs: {
			start: 0,
			query: keyword
		},
		headers: {
			Authorization: config.AUTH_HEADER + config.AUTH_TOKEN
		}
	}, (error, response, body) => {
		
		console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
		//console.log(`STATUS: ${response.statusCode}`);
		//console.log(`MESSAGE: ${response.statusMessage}`);
		console.log('Response Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content)
			
			response = content.hasOwnProperty('hydra:totalItems') ? `Found ${content['hydra:totalItems']}` :
															'No appropriate FAQ found'

			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}
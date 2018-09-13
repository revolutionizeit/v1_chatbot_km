const request = require('request');
const config = require('../config');

exports.getContent = (keyword, cb) => {
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
		
		//console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
		console.log('Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content){				
				response = content.hasOwnProperty('hydra:totalItems') ? `Found ${content['hydra:totalItems']} articles.\n` :
																'No appropriate FAQ found'
				let results = content['hydra:member'];
				//console.log(results);
				
				if(results!== null && results !== ''){
					results.forEach(element => {
						let name = element['hydra:member'][0]['vkm:name'];
						let description = element['hydra:member'][0]['vkm:description'];
						console.log('KM Name: '+name);
						console.log('KM Desc: '+description);
						response += name +'-'+ description + '.\n';
					});
				}
			}
			response = response.replace(/\\n/g, '\n');
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}
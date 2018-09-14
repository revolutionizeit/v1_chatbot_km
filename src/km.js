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
				let textStr = content.hasOwnProperty('hydra:totalItems') ? `Found ${content['hydra:totalItems']} articles.` :
																'No appropriate FAQ found'
				
				response.textOnly = textStr;
				response.text= {"text": [textStr]};
				let results = content['hydra:member'];
				
				if(results!== null && results !== '' && results.length>0){
					let listSelectItems = [];
					let cardResp="";

					results.forEach(element => {
						let name = element['hydra:member'][0]['vkm:name'];
						let description = element['hydra:member'][0]['vkm:description'];
						//console.log('KM Name: '+name);
						//console.log('KM Desc: '+description);

						cardResp= {
								"title": name,
								"subtitle": description,
								"imageUri": "http://blog.buildabazaar.com/wp-content/uploads/2018/06/FAQ.gif",
								"buttons": [{
									"text": "More Details",
									"postback": "https://www.hsbc.co.uk/ways-to-bank/online-banking/"
								}]							
						}
						
						
						let item={
							"info": {
								"key": name,
								"synonyms": [
									keyword
								]
							},
							"title": name,
							"description": description							
						  };

						  if(item!==null && item !=='')
							  listSelectItems.push(item);
							  
					});

					
					//list
					if(listSelectItems!==null && listSelectItems !=='' && listSelectItems.length>0){
						console.log("l:"+listSelectItems.length);
						let listSelect={
							"title": "ListSelectTitle",
							"items": listSelectItems
						};
						response.list = listSelect;
					}

					//card
					response.card=cardResp;
				}
			}
			
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}

exports.getTags = (cb) => {
	let response="";
	request({
		uri: config.PROTOCOL + config.HOST + config.TAG_URI,
		qs: {
			start: 0,
			size: 100
		},
		headers: {
			Authorization: config.AUTH_HEADER + config.AUTH_TOKEN
		}
	}, (error, response, body) => {
		console.log('Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content){				
				let results = content['hydra:member'];
				
				if(results!== null && results !== '' && results.length>0){
					let suggestionLists = [];
					results.forEach(element => {
						let name = element['vkm:name'];
						console.log('Tag Name: '+name);			
						
						let suggestion={
							"title": name						
						  };

						  if(suggestion!==null && suggestion !=='')
						  suggestionLists.push(suggestion);
						  break
							  
					});
					
					//suggestions chip
					if(suggestionLists!==null && suggestionLists !=='' && suggestionLists.length>0){
						console.log("l:"+suggestionLists.length);
						response.suggestions = suggestionLists;
					}
				}
			}
			
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}

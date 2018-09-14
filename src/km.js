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

exports.getTags = (tag, cb) => {
	let response="";
	let uriPath="";

	if(tag!== null || tag == ''){
		uriPath = config.TAG_URI;
	}else if (tag='Business Unit'){
		uriPath = config.TAG_URI + config.TAG_KBASE_URI;
	}else if (tag='Group'){
		uriPath = config.TAG_URI + config.TAG_PRODUCT_URI;
	}else if (tag='Content Type'){
		uriPath = config.TAG_URI + config.TAG_REGION_URI;
	}else if (tag='Browse Topic'){
		uriPath = config.TAG_URI + config.TAG_TOPIC_URI;
	}else{
		uriPath = config.TAG_URI;
	}

	request({
		uri: config.PROTOCOL + config.HOST + uriPath,
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
					let quickReplies = [];
					results.forEach(element => {
						let name = element['vkm:name'];
						console.log('Tag Name: '+name);			
						  quickReplies.push(name);							  
					});
					
					//quickReplies
					if(quickReplies!==null && quickReplies !=='' && quickReplies.length>0){
						console.log("l:"+quickReplies.length);
						let quickRepliesJson={
							"title": "List of available tags",
							"quickReplies": quickReplies
						};
						response.quickReplies = quickRepliesJson;
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

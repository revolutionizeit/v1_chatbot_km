'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const km = require('./src/km');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

app.use(bodyparser.urlencoded({
	extended: true
}))
app.use(bodyparser.json());

app.post('/webhook', (req, res) => {
	
	console.log('Received a post request');
	if(!req.body) return res.sendStatus(400)
	let data = req.body;
	let action = data.queryResult.action;
	let parameters = data.queryResult.parameters;
	let webhookResp ="";

	// Performing the action
	if( action === 'getFAQ'){
		console.log('Action: ' +action+' Parameter: '+parameters['question']);
		let keyword = data.queryResult.parameters['question'] ? parameters['question'] : 'hsbc';
		km.getContent(keyword, response => {
			//console.log('t: %j',response.text);
			//console.log('l: %j',response.list);
			let webhookResp = {
				fulfillmentText: response.textOnly,
				fulfillmentMessages: 	[
											{
												/*"text": {"text": ["Welcome to HSBC FAQs"]},
												"listSelect": response.list*/
												"card": response.card
											}
										]
				,source:"em-km-api-webhook-response"
			};
			
			console.log('r: %j',webhookResp);
			return res.json(webhookResp);	
		});
	}else if ( action=== 'getTags'){
		km.getTags(response => {
			let webhookResp = {
				fulfillmentText: response.textOnly,
				fulfillmentMessages: 	[
											{
												"suggestions": response.suggestions
											}
										]
				,source:"em-km-tags-api-webhook-response"
			};

			console.log('r: %j',webhookResp);
			return res.json(webhookResp);
		});
	}else{
		console.error(`Unhandled action ${action}`);
	}

	
})

app.listen(process.env.PORT || 8000, () => {
	console.log('Server up and running');
})


'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const km = require('./src/km');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

app.use(bodyparser.urlencoded({
	extended: true
}))
app.use(bodyparser.json());

app.post('/webhook', (req, res) => {
	const agent = new WebhookClient({ req, res });
	console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

	function welcome (agent) {
		agent.add(`Welcome to my agent!`);
	}

	function fallback (agent) {
		agent.add(`I didn't understand`);
		agent.add(`I'm sorry, can you try again?`);
	}

	// Run the proper function handler based on the matched Dialogflow intent name
	let intentMap = new Map();
	intentMap.set('Default Welcome Intent', welcome);
	intentMap.set('Default Fallback Intent', fallback);
	// intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
	// intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
	agent.handleRequest(intentMap);

	/*
	console.log('Received a post request');
	if(!req.body) return res.sendStatus(400)
	let data = req.body;

	//let action = data.result.action ? data.result.action : '';
	//console.log('Here is the post request from DialogFlow');
    //console.log('Data:'+data);

	console.log('Got question parameter from DialogFlow: '+data.queryResult.parameters['question']);
	let keyword = data.queryResult.parameters['question'] ? data.queryResult.parameters['question'] : 'hsbc';
	km.getContent(keyword, response => {

		return res.json({
			fulfillmentText: response
			,fulfillmentMessages: [{"text": {"text": [response]}}]
			,source:"em-km-api-webhook-response"
		})

	});
*/

})

app.listen(process.env.PORT || 8000, () => {
	console.log('Server up and running');
})


'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const km = require('./src/km');

app.use(bodyparser.urlencoded({
	extended: true
}))
app.use(bodyparser.json());

app.post('/webhook', (req, res) => {
	console.log('Received a post request');
	if(!req.body) return res.sendStatus(400)
	let data = req.body;

	//let action = data.result.action ? data.result.action : '';
	console.log('Here is the post request from DialogFlow');
    //console.log(data);

	console.log('Got question parameter from DialogFlow '+data.queryResult.parameters['question']);
	let keyword = data.queryResult.parameters['question'] ? data.queryResult.parameters['question'] : 'hsbc';
	km.getContent(keyword, response => {

		return res.json({
			fulfillmentText: response
			,fulfillmentMessages: [{"text": {"text": [response]}}]
			,source:"em-km-api-webhook-response"
		})

	});
})

app.listen(process.env.PORT || 8000, () => {
	console.log('Server up and running');
})


"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app=express();
var urlencodedParser = bodyParser.urlencoded({extended:false});
var googleTTS = require('google-tts-api');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
//  res.sendFile(__dirname + '/index.html');
  res.render('index');
});

app.get('/contact', function(req, res){
//  res.sendFile(__dirname + '/contact.html');
  console.log(req.query);
//  res.render('contact', {qs: req.query});
  res.render('contact', {qs: req.query});
});

app.get('/speak/:id', function(req, res){
  googleTTS(req.params.id, 'zh', 1)
  .then(function(url){
    res.redirect(url)
  })
  .catch(console.error);
});

app.post('/contact', urlencodedParser, function(req, res){
  console.log(req.body);
//  res.sendFile(__dirname + '/contact.html');
  res.render('contact-success', {data: req.body});
});

app.get('/profile/:id', function(req, res){
//  res.send('You requested to see aprofile with the id of ' + req.params.id);
  var data={age: 29, job: 'ninja', hobbie: ['eating', 'fighting', 'fishing']};
  res.render('profile', {person: req.params.id, data: data});
});

app.post('/webhook', function (req, res) {

if (req.body.result.metadata.intentName==="數字相加"){
	var result={
    "speech": req.body.result.parameters.no1+req.body.result.parameters.no2,
//  "speech": req.body.result.resolvedQuery,
//  "speech": "現在用的是Symore自訂的webhook",
		"displayText": "Barrack Husse",
		//"data" {...},
		//"contextOut":[...],
		"source": "my-server"
	}
  res.send(result);
}

if (req.body.result.metadata.intentName==="Default Welcome Intent"){
	var result={
    "speech": "這是自訂的字串，您剛剛對我說了 \""+req.body.result.resolvedQuery+"\".",
//  "speech": req.body.result.resolvedQuery,
//  "speech": "現在用的是Symore自訂的webhook",
		"displayText": "Barrack Husse",
		//"data" {...},
		//"contextOut":[...],
		"source": "my-server"
	}
  res.send(result);
}


});
app.listen(3000);

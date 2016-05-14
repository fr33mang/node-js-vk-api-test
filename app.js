express = require('express');
var app = express();
var config = require('config.json')('./config/conf.json');
var exphbs  = require('express-handlebars');

console.log(config.port + " " + config.redirectUri);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public/"));

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

var request = require('request');
var urlutils = require('url');


/*CHANGE FOR DEPLOY*/
var appId = config.appId;
var clientSecret = config.clientSecret;
var redirect_uri = config.redirectUri;

/*CHANGE FOR DEPLOY*/

app.get("/auth", function(req, res){

	var getCodeUrl = "https://oauth.vk.com/authorize?client_id=" + appId + 
	"&display=page&redirect_uri=" + redirect_uri + "&scope=audio&response_type=code&v=5.50";

	res.redirect(getCodeUrl);

});

app.get("/verify", function(req, res){

	var accessToken;
	var user;

	console.log(req.query);

	if (req.query.error)
		res.send(res.query.error);

	var url = "https://oauth.vk.com/access_token?client_id=" + appId + 
	"&client_secret=" + clientSecret + "&redirect_uri=" + redirect_uri + "&code=" + req.query.code;

	request.get(url, function(err, response, body) {

		var mes = JSON.parse(body);
		user = mes.user_id;
		access_token = mes.access_token;
		console.log("sucess access token!!!");
	//	res.end("hello " + access_token);
	res.redirect("/music?owner_id=" + user + "&access_token=" + access_token);
});	

});

app.get("/music", function(req, res){

	var url = "https://api.vk.com/method/audio.get?owner_id=" + req.query.owner_id + 
	"&need_user=0&count=6000&v=5.50&access_token=" + req.query.access_token;

	request.get(url, function(err, response, body) {

		var data = JSON.parse(body);
		
		if(err){
			console.log(err)
			throw new Error(err);
		}

		if (data.error){
			console.error(data.error);
			throw new Error(data.error);		
		}	else {
			data.title = 'MyVkMusic';
			data.first = data.response.items[0].url;

			data.response.items.forEach(function(item, i , arr){
				var minutes = Math.floor(item.duration / 60);
				var seconds = item.duration - minutes * 60;
				if (seconds < 10){
					seconds = '0'+ +seconds;
				}
				item.duration = minutes + ':' + seconds;

			});
			
			res.render("music", data);
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Sucess");
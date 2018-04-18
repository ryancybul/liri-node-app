//Load the requred node modules
require("dotenv").config();

var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

//Load the keys
var keys = require('./keys');

//Initialize spotify and twitter clients
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//Variables
var module = process.argv[2];
var userSearch = process.argv[3];

//Functions 
if (module === 'my-tweets') {
    myTweets();
}
else if (module === 'spotify-this-song') {
    spotifySong();
}
else if (module === 'movie-this') {
    movieSearch();
}
else if (module === 'do-what-it-says') {
    fs.readFile('random.txt', 'utf8', function(error, data){
        let text = data.split(',');
        spotifySong(text)
    })
} 
//Displays directions for user if they do not enter a proper command
else {
    console.log("Type in one of the commands after 'node liri.js' :" + '\n'
    + '1. my-tweets' + '\n'
    + "2. spotify-this-song 'any song name'" + '\n'
    + "3. movie-this 'any movie title'" + '\n'
    + "4. do-what-it-says")
}

function myTweets(){
    var params = {screen_name: 'RyanCybul'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets = tweets.reverse();
            console.log('\n');
            for(let i = 0; i < tweets.length ; i++){
                tweet = ('Tweet #' + (i+1) + ' ' + tweets[i].text);
                console.log(tweet);
                append(tweet + '\n');
                if(i === 20 ){
                    break;
                }
            }
        }
    });
}

function spotifySong(text) {
    //If user does not enter a song title search the sign
    if(!userSearch) {
        userSearch = 'The Sign';
    } else if (text) {
        userSearch = text;
    }
    spotify.search({ type: 'track', query: userSearch }, function(err, data) {
        if (!err) {
            for(i = 0; i < data.tracks.items.length; i++){
                var songInfo = data.tracks.items[i];
                console.log("------------------");
                //Artist
                console.log('Artist: ' + songInfo.artists[0].name);
                //Song name
                console.log('Song name: ' + songInfo.name);
                //Spotify link
                console.log('Preview URL: ' + songInfo.preview_url);
                //Album Name
                console.log('Album: ' + songInfo.album.name);
                //Append to file
                append("------------------" + '\n' + 'Artist: ' + songInfo.artists[0].name + '\n'+ 'Song name: ' + songInfo.name + '\n' + 'Preview URL: ' + songInfo.preview_url + '\n' +'Album: ' + songInfo.album.name + '\n');
            }
        } 
    });
}

function movieSearch() {
    if (!userSearch) {
        userSearch = 'Mr. Nobody';
    }
    request("http://www.omdbapi.com/?t="+userSearch+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
        // Parse the body of the site and recover just the imdbRating
        let movieInfo = JSON.parse(body);
        console.log("------------------");
        //Title of Movie
        console.log('Movie Title: ' + movieInfo.Title);
        //Year the movie came out
        console.log('Year Released: ' + movieInfo.Year);
        //IMDB Rating
        console.log('IMDB Rating: ' + movieInfo.imdbRating);
        //Rotten Tomatoes Rating
        console.log('Rotten Tomatoes Rating: ' + movieInfo.Ratings[1].Value);
        //Country the movie was produced
        console.log('Country: ' + movieInfo.Country);
        //Language
        console.log('Languages: ' + movieInfo.Language);
        //Plot of movie
        console.log('Plot: ' + movieInfo.Plot);
        //Actor
        console.log('Actors: ' + movieInfo.Actors);
        append('\n' + 'Movie Title: ' + movieInfo.Title + '\n' + 'Year Released: ' + movieInfo.Year + '\n' + 'IMDB Rating: ' + movieInfo.imdbRating + '\n' + 'Rotten Tomatoes Rating: ' + movieInfo.Ratings[1].Value + '\n' + 'Country: ' + movieInfo.Country + '\n' + 'Languages: ' + movieInfo.Language + 'Plot: ' + movieInfo.Plot + '\n' + 'Actors: ' + movieInfo.Actors + '\n')
    }
    });
} 
//Append data to log.txt file
function append(appendThis) {
    fs.appendFile('./log.txt', appendThis, function(err){
        if(err) {
        }
    });
}




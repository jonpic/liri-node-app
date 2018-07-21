require('dotenv').config();
const keys = require('./keys.js');
const request = require('request');
const fs = require('fs');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const twitter = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);

const userInputOne = process.argv[2];
const userInputTwo = process.argv[3];

// function for the switch statement that is the main logic of the program
function appStart(userInputOne, userInputTwo) {
    switch (userInputOne) {
        case 'spotify-this-song':
            spotifySearch(userInputTwo);
            break;
        case 'this-user-tweets':
            twitterDisplay(userInputTwo);
            break;
        case 'movie-this':
            omdbDisplay(userInputTwo);
            break;
        case 'do-what-it-says':
            random();
            break;
        default:
            break;
    }
}

// function that makes a spotify request
function spotifySearch(userInput) {
    
    const songName = userInput;
    
    
    spotify.search({ type: 'track', query: songName, limit: 5 }, function(err, data) {
        if (err) {
            return console.log(err);
        }
        // log data about the song passed as an argument or 'The Sign' as default
        if (songName) {
            console.log(`The artist is: ${data.tracks.items[0].artists[0].name}`); 
            console.log(`The song is: ${data.tracks.items[0].name}`);
            console.log(`The album is: ${data.tracks.items[0].album.name}`);
            console.log(`You can listen at: ${data.tracks.items[0].external_urls.spotify}`);
        } else {
            console.log('Something went wrong')
        }
    });
}

function twitterDisplay(userInput) {
    
    const accountUser = userInput;
    
    const params = {screen_name: accountUser};
    twitter.get('statuses/user_timeline', params, function(err, tweets, response) {
        if (!err) {
            for (var i = 0; i < 2; i++) {
                console.log(tweets[i].text);
            }
        }
    });
}



// function that makes an OMDB request
function omdbDisplay(userInput) {
    const movieName = userInput
    console.log('here')
    console.log(userInput)
    
    
    // Then run a request to the OMDB API with the movie specified
    const queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy';
    // Then run a request to the OMDB API with the movie specified
    request(queryUrl, function(error, response, body) {
        // If the request is successful 
        if (!error && response.statusCode === 200) {
            // Then log info about the movie
            console.log(`The movie is: ${JSON.parse(body).Title}`);
            console.log(`It was released in ${JSON.parse(body).Year}`);
            console.log(`It has an IMDB rating of ${JSON.parse(body).Ratings[0].Value}`);
            console.log(`It has a rotten tomato rating of ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`It was released in ${JSON.parse(body).Country}`);
            console.log(`The language it was released in was ${JSON.parse(body).Language}`);
            console.log(`A brief summary of the plot ${JSON.parse(body).Plot}`);
            console.log(`The main actors were ${JSON.parse(body).Actors}`);
        } else {
            return console.log(error);
        }
    });
}

// function that reads the random text file and does what it says
function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        // if the code experiences any errors it will log them to the console
        if (error) {
            return console.log(error);
        } 
        const readArr = data.split(',');
        
        userInputOne = readArr[0];

        liriSwitch(userInputOne, readArr[1]);
    });
}

// run the liriswitch function
appStart(userInputOne, userInputTwo);
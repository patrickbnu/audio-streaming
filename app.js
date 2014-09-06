'use strict';

var BinaryServer, express, http, path, app, audio, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
mongoose = require('mongoose');
http         = require('http');
path         = require('path');
app          = express();
audio        = require('./lib/audio');




////----------- imagem no banco -------------////
/// https://gist.github.com/aheckmann/2408370 ///
////-----------------------------------------////


//   http://microjs.com/#

// all environments
//app.use(express.favicon()); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Audio Server started on http://0.0.0.0:3000');
});

bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            case 'list':
                audio.list(stream, meta);
                break;

            case 'request':
                audio.request(client, meta);
                break;
        }
    });
});


var mongoose = require('mongoose');
mongoose.connect('localhost', 'music');




var schema = new mongoose.Schema({
    music: { 
    	name : String,
      	data: Buffer, 
      	contentType: String 
    }
});
 

// our model
var Music = mongoose.model('Music', schema);
var music;
 
mongoose.connection.on('open', function () {
    console.error('mongo is open');
   
    // empty the collection
    Music.remove(function (err) {
        if (err) throw err;     
        console.error('removed old docs');      
    });

    //store();
 
});

 /*

function store(){
// store an music in binary in mongo
    m = new Music;
    m.music.name = "xpto";
    m.music.data = fs.readFileSync('./audio/music.mp3');
    m.music.contentType = 'audio/mpeg';
    m.save(function (err, a) {
        if (err) throw err;
   
        console.error('saved music to mongo');
        
       // server();

    });
}

function server(){

            // start a demo server
        var server = express();
        server.get('/', function (req, res) {

        //	Music.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {

        //	}
        	
            Music.findById(m, function (err, doc) {
                if (err) return next(err);
                res.contentType(doc.music.contentType);
                res.send(doc.music.data);
            });
        });
   
        server.on('close', function () {
            console.error('dropping db');
            mongoose.connection.db.dropDatabase(function () {
                console.error('closing db connection');
                mongoose.connection.close();
            });
        });
   
        server.listen(3333, function (err) {});
   
        process.on('SIGINT', function () {
            server.close();
        });
}
*/
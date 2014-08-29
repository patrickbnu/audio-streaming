var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var http         = require('http');
 
// music path
var path = './audio/music.mp3';
 
// connect to mongo
mongoose.connect('localhost', 'testing_storemusic');
 
// example schema
var schema = new Schema({
    music: { 
      data: Buffer, 
      contentType: String 
    }
});
 
// our model
var A = mongoose.model('A', schema);
 
mongoose.connection.on('open', function () {
    console.error('mongo is open');
   
    // empty the collection
    A.remove(function (err) {
        if (err) throw err;
     
        console.error('removed old docs');
     
        // store an music in binary in mongo
        var a = new A;
        a.music.data = fs.readFileSync(path);
        a.music.contentType = 'audio/mpeg';
        a.save(function (err, a) {
            if (err) throw err;
       
            console.error('saved music to mongo');
       
            // start a demo server
            var server = express();
            server.get('/', function (req, res) {
                A.findById(a, function (err, doc) {
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
          });
    });
 
});
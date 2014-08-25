/**
 *
 * @module audio
 */
'use strict';

var fs, audioPath, supportedTypes;

fs             = require('fs');
audioPath     = __dirname + '/../audio';

module.exports = {
    list    : list,
    request : request
};

_checkAudioDir();

function _checkAudioDir(cb) {
    cb = cb || function () {};

    fs.stat(audioPath, function (err, stats) {
        if (
            (err && err.errno === 34) ||
            !stats.isDirectory()
           ) {
            // if there's no error, it means it's not a directory - remove it
            if (!err) {
                fs.unlinkSync(audioPath);
            }

            // create directory
            fs.mkdir(audioPath, cb);
            return;
        }

        cb();
    });
}

/**
 */
function list(stream, meta)  {
    _checkAudioDir(function () {
        fs.readdir(audioPath, function (err, files) {
            stream.write({ files : files });
        });
    });
}

/**
 */
function request(client, meta) {
    var file = fs.createReadStream(audioPath + '/' + meta.name);
    client.send(file);
}
var express = require('express');
var multer = require('multer');
var path = require('path')
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var app = express();

aws.config.loadFromPath('./s3.config.json');

var s3 = new aws.S3();

var storage = multerS3({
    s3: s3,
    bucket: 'mehulbaid-demo',
    metadata: function (req, file, callback) {
        callback(null, { fieldName: file.fieldname });
    },
    key: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now().toString() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage }).single('userPhoto');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});



app.post('/api/photo', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.status(200).send("File is uploaded");
    });
});

app.listen(3000, function () {
    console.log("Working on port 3000");
});
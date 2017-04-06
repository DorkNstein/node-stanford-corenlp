var options = {
    verbose: true
};
var http = require('http');
var url = require('url');

// var language = require('@google-cloud/language')({
//     projectId: 'nlp-test-158819',
//     keyFilename: './nlp-googlecreds.json'
// });

var gcloud = require('google-cloud');
var language = gcloud.language({
    projectId: 'nlp-test-158819',
    keyFilename: './NLP-test.json'
});
var document = language.document('what is tomorrow morning 10am at Google?');
var server = http.createServer(function(request, response) {
    // var queryData = url.parse(request.url, true).query;
    response.writeHead(200, { "Content-Type": "text/plain" });

    document.annotate(options, function(err, data) {
        if (err) console.log("errr..", err);
        var entities = data[0];
        var apiResponse = data[1];
        // console.log("annotate", JSON.stringify(data), entities, apiResponse);
        response.end(JSON.stringify(data));
    });
    document.detectEntities(options, function(err, data) {
        if (err) console.log("errr..", err);
        console.log("entities", JSON.stringify(data));
        // response.end(JSON.stringify(data));
    });
});
console.log('server listening...');
server.listen(8990);

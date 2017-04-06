var http = require('http');
var apiai = require('apiai');
var request = require('request');
var uuid = require('uuid');
var url = require('url');
// var app = apiai("140f6176c51a409088826f731c199287"); // HotelBooking
// var app = apiap("b3aa923b6357439ca35239005d3d12ef"); // AlarmTube
var app = apiai("a5799c668f52475680d5e4cee01e3640"); // Medibooker


var entities = [{
    name: "speciality",
    // extend: true,
    entries: [{
        value: "ear",
        synonyms: [
            "earpain",
            "earache",
            "earhurts"
        ]
    }, {
        value: "neck",
        synonyms: [
            "neckhurts",
            "neckpain",
            "shoulderache"
        ]
    }]
}];

// let opts = {
//     uri: 'https://api.api.ai/v1/entities?v=20150910',
//     body: {
//         name: "hotel_chains",
//         // extend: true,
//         entries: [{
//             value: "head",
//             synonyms: [
//                 "headpain",
//                 "headache",
//                 "headhurts"
//             ]
//         }, {
//             value: "neck",
//             synonyms: [
//                 "neckhurts",
//                 "neckpain",
//                 "shoulderache"
//             ]
//         }]
//     },
//     headers: {
//         'Authorization': 'Bearer e6f3e291c1eb4000a610367f75779d74',
//         'Content-Type': 'application/json; charset=utf-8'
//     }
// }

// console.log("making request..");
// request.post(opts, function(err, resp, body) {
//     console.log("err:", err);
//     console.log("resp:", resp);
//     console.log("body:", body);
//     response.end('hello');
// });
var options = {
    entities: entities,
    sessionId: uuid.v1()
};
var server = http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
    console.log(queryData);
    if (!!queryData.q) {
        response.writeHead(200, { "Content-Type": "text/plain" });

        var req = app.userEntitiesRequest(options);

        req.on('response', function(resp) {
            console.log("response", resp);
            // response.end(JSON.stringify(resp));
            console.log("-------------------- end -------------------");
            var req2 = app.textRequest('ctscan abdomen and Pelvis tomorrow', { sessionId: "124" });

            req2.on('response', function(resp2) {
                console.log('Query resp2: ');
                console.log(resp2);
                response.end(JSON.stringify(resp2));
            });

            req2.on('error', function(error) {
                console.log("error", error);
            });

            req2.end();
        });

        req.on('error', function(error) {
            console.log("error", error);
        });

        req.end();
    }
});
console.log('server listening...');
server.listen(8880);

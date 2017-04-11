var http = require('http');
var apiai = require('apiai');
var request = require('request');
var uuid = require('uuid');
var url = require('url');
// var app = apiai("140f6176c51a409088826f731c199287"); // HotelBooking
// var app = apiap("b3aa923b6357439ca35239005d3d12ef"); // AlarmTube
var app = apiai("a5799c668f52475680d5e4cee01e3640"); // Medibooker
let headers = {
    'Authorization': 'Bearer efac800c605f484ca6c256d9e6d0a158',
    'Content-Type': 'application/json; charset=utf-8'
}
var server = http.createServer(function(req, res) {
    var queryData = url.parse(req.url, true).query;
    console.log(queryData);
    if (!!queryData.q) { // To avoid multiple calls on refresh
        res.writeHead(200, { "Content-Type": "text/plain" });

        let opts2 = {
            uri: 'https://api.api.ai/v1/entities',
            headers: headers,
            json: true
        }
        request.get(opts2, function(err, resp, body) {
            console.log("err1:", err);
            console.log("body1:", body);
            let id;
            let name = 'speciality'
            for (let i = 0; i < body.length; i++) {
                if (body[i].name == name) {
                    id = body[i].id;
                    break;
                }
            }
            console.log(name, id);
            let opts = {
                uri: 'https://api.api.ai/v1/entities/' + id + '?v=20150910',
                headers: headers,
                json: true
            }
            request.get(opts, function(err, resp, body2) {
                console.log("err2:", err);
                console.log("body2:", body2);
                let entries = [{
                    "value": "Abdomen",
                    "synonyms": ["a"]
                }]
                let postData = body2;

                postData.entries = postData.entries.concat(entries);

                let opts = {
                    uri: 'https://api.api.ai/v1/entities/' + id + '?v=20150910',
                    body: postData,
                    headers: headers,
                    json: true
                }
                request.put(opts, function(err, resp, body3) {
                    console.log("err3:", err);
                    console.log("body3:", body3);
                    let result = {
                        entities: body,
                        entities_of_id: body2,
                        postedData: postData.entries,
                        updateStatus: body3
                    }
                    res.end(JSON.stringify(result));
                });
            });
        });
    }
});
server.listen(8880);
console.log('server listening...');


// TODO: Just Text request and response


// var req2 = app.textRequest('my abdomen and Pelvis hurts. Want an xray on next friday', { sessionId: "124" });

// req2.on('response', function(resp2) {
//     console.log('Query resp2: ');
//     console.log(resp2);
//     response.end(JSON.stringify(resp2));
// });

// req2.on('error', function(error) {
//     console.log("error", error);
// });

// req2.end();

// TODO: Below is request for making a query after adding entities. Still needs work

// var entities = [{
//     name: "speciality",
//     // extend: true,
//     entries: [{
//         value: "ear",
//         synonyms: [
//             "earpain",
//             "earache",
//             "earhurts"
//         ]
//     }, {
//         value: "neck",
//         synonyms: [
//             "neckhurts",
//             "neckpain",
//             "shoulderache"
//         ]
//     }]
// }];

// var options = {
//     entities: entities,
//     sessionId: uuid.v1()
// };
// var req = app.userEntitiesRequest(options); // Entities added only last for this user per session

// req.on('response', function(resp) {
//     console.log("response", resp);
//     // response.end(JSON.stringify(resp));
//     console.log("-------------------- end -------------------");
//     var req2 = app.textRequest('ctscan abdomen and Pelvis tomorrow', { sessionId: "124" });

//     req2.on('response', function(resp2) {
//         console.log('Query resp2: ');
//         console.log(resp2);
//         response.end(JSON.stringify(resp2));
//     });

//     req2.on('error', function(error) {
//         console.log("error", error);
//     });

//     req2.end();
// });

// req.on('error', function(error) {
//     console.log("error", error);
// });

// req.end();



// TODO: For developer adding entities through api

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

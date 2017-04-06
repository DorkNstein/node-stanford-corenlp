var NLP = require('../');
var path = require('path');

var config = {

    'nlpPath': path.join(__dirname, './../corenlp'), //the path of corenlp
    'version': '3.6.0', //what version of corenlp are you using
    'annotators': ['tokenize', 'ssplit', 'pos', 'parse', 'sentiment', 'depparse', 'lemma', 'ner'], //optional!
    'extra': {
        'depparse.extradependencie': 'MAXIMAL'
    }

    //  'language': {
    //   'jar': path.join ( __dirname,'./../corenlp/stanford-chinese-corenlp-2014-02-24-models.jar'),
    //   'properties': path.join ( __dirname,'./../corenlp/StanfordCoreNLP-chinese.properties')
    // }

};

var coreNLP = new NLP.StanfordNLP(config);

var http = require('http');
var url = require('url');


var server = http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
    response.writeHead(200, { "Content-Type": "text/plain" });

    if (queryData.q) {
        console.log(queryData.q);
        coreNLP.process(queryData.q, function(err, result) {
            if (err)
                throw err;
            else {
                // response.end(JSON.stringify(result));
                noun_tags_list = []
                ne_tags_list = {};

                noun_tags = ['NN', 'NNS', 'NNP', 'NNPS'] //list of noun related tags
                ner_types = ['PERSON', 'LOCATION', 'ORGANIZATION', 'MONEY', 'PERCENT', 'DATE', 'TIME'] //list of interested entities
                tokens = []
                sentences = result.document.sentences.sentence

                // To handle single sentence titles
                if (!sentences.length) {
                    console.log('Only a single sentence')
                    tokens = tokens.concat(sentences.tokens.token)
                }


                // To handle multiple sentence titles. 
                //Datastrucutre is slightly different for single is dictionary/map and multiple is array
                sent_tokens = []
                for (var i = 0; i < sentences.length; i++) {
                    sent_tokens = sentences[i].tokens.token

                    //console.log("sent tokens here 2")
                    tokens = tokens.concat(sent_tokens)
                }

                //console.log(tokens.length)    

                // Get only nouns
                for (var i = 0; i < tokens.length; i++) {

                    console.log(tokens[i].NER, tokens[i].word);
                    //Entities
                    if (ner_types.indexOf(tokens[i].NER) > -1) {
                        if (!!ne_tags_list[tokens[i].NER])
                            ne_tags_list[tokens[i].NER] = ne_tags_list[tokens[i].NER] + ' ' + tokens[i].word;
                        else
                            ne_tags_list[tokens[i].NER] = tokens[i].word;
                    };

                    //nouns
                    if (noun_tags.indexOf(tokens[i].POS) > -1) {
                        //console.log(tokens[i].word);
                        //console.log(tokens[i].POS);
                        noun_tags_list = noun_tags_list.concat(tokens[i].word);

                    }
                }

                //console.log(tags_list)
                console.log('results returned', JSON.stringify({ 'nouns': noun_tags_list, 'ner': ne_tags_list }))

                ///Set headers and return JSON
                response.writeHead(200);
                response.end(JSON.stringify(result));
            }
        });
    } else {
        response.end("Hello!\n");
    }
});

server.listen(8890);

const createClient = require('pexels').createClient;
const url = require("url");
const client = createClient('563492ad6f917000010000010f467ca7eacc4aa1becd1477e1680cd1');
const http = require("http");
const ColorThief = require("colorthief");

const routes = {
    "/getRandomImage": {
        type: "get",
        exec: function(req,res) {
            const queryObject = url.parse(req.url,true).query;
            client.photos.search(queryObject).then(response => {
                if (response.photos.length === 0) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end("No picture");
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                const photo = response.photos[rand(0,response.photos.length-1)];
                ColorThief.getColor(photo.src.medium).then(response => {
                    photo.dominantColor = "rgb("
                        +Math.min(255, parseInt(response[0])+50)+", "
                        +Math.min(255, parseInt(response[1])+50)+", "
                        +Math.min(255, parseInt(response[2])+50)+")";
                    res.end(JSON.stringify(photo));
                });
            });
        }
    }

}

http.createServer(function (req, res) {
    const url = req.url.split("?")[0];
    if (routes[url]) {
        routes[url].exec(req,res);
    } else {
        res.write('Error 404'); //write a response to the client
        res.end(); //end the response
    }
}).listen(8080); //the server object listens on port 8080

function rand(a,b) {
    return a+Math.floor(Math.random()*(b-a+1));
}
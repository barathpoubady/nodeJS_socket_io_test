var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./app/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    // Quand un client se connecte, on lui envoie un message
    socket.emit('messageConnection', 'Vous êtes bien connecté !');
    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('messageOther', 'Un autre client vient de se connecter ! ');

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('messageAdd', function (message) {
        
        socket.broadcast.emit('message', socket.pseudo + ' : ' + message);
    }); 
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
server.listen(port);
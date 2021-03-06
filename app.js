var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var mysql=require("./database/mysql.js");
//llamada a socket.io
var io=require("socket.io");
var query=mysql({
    host:"localhost",
    user:"root",
    password:"",
    database:"trivia"
});
/*query.get("partida").execute(function(rows){
    console.log(rows);
});*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
var nicknames=[];
var PORT=3000;
var http=app.listen(PORT,function(){
    console.log("Corriendo el puerto "+PORT);
});
var partidas=Array();
var sockets=io(http);
sockets.on("connection",function(socket){
    socket.on("mensajes",function(clientedata){
        if(clientedata.nick===socket.nickname)
        {
            var comando=clientedata.msn.split(" ");
            if(comando[0]=="join")
            {
                var sala=comando[1];
                sockets.to(socket.sala).emit("mensajes",{"nick":"SERVIDOR","msn":"El usuario "+socket.nickname+" Esta conectado a la sala "+sala});
                socket.leave(socket.sala);
                socket.sala=sala;
                socket.join(sala);
                return;
            } 
            sockets.to(socket.sala).emit("mensajes",clientedata);
            return;
        }
        sockets.sockets.emit("mensajes",false);
    });
    socket.on("get_lista",function(clientedata){
        sockets.sockets.emit("get_lista",{"lista":nicknames});
    });
    socket.on("partidanueva",function(cliente){
        partidas.push(cliente);
        socket.broadcast.emit("partidanueva",partidas)
    });
    socket.on("setnickname",function(clientedata){
        if(verificarCuenta(clientedata.nick,socket)){
            nicknames.push(clientedata);
            socket.sala="general";
            socket.join("general");
            socket.nickname=clientedata.nick;
            socket.emit("setnickname",{"server":true});
            return;
        }
        socket.emit("setnickname",{"server":"El nick no esta disponible"});
        return;
    });  
});
var verificarCuenta=function(ins,socket)
{
    for(var i=0;i<nicknames.length;i++)
    {
        if(nicknames[i].nick==ins)
        {
            return false;
        }
    }
    query.get("usuario").where({nick:ins}).execute(function(rows){
        if(rows.length==0)
        {
            query.save("usuario",{nick:ins,nombres:ins,apellidos:ins},function(r){
                socket.idus=r.insertId;
                console.log(socket.idus);
            })
        }else{
            socket.idus=rows[0].id;
            console.log(socket.idus);
        }
        console.log();
    })
    return true;
}
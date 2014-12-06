$(function($){
	var socket=io();
	$("#partida").submit(function(event) {
		//enviar
		socket.emit("partidanueva",$(this).serializeObject());
		return false;
	});
	//escuchar al servidor
	socket.on("partidanueva",function(server){
		html="";
		for (var i=0;i<server.length;i++)
		{
			html+="<table border='1' width='300'><tr><td>TITULO DE PARTIDA  </td><td>"+server[i].partida+"</td></tr>";
			html+="<tr><td>TIPO  </td><td>"+server[i].tipo+"</td></tr>";
			html+="<tr><td>TIEMPO DE RESPUESTA  </td><td>"+server[i].tiempo+"</td><tr>";
			html+="<tr><td colspan='2'><input type='submit' value='jugar'></td></tr></table>";
		}
		$("#container").html(html);
	});
});
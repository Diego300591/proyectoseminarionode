$(function($) {
	var socket=io();
	$("#nickname").keydown(function(event) {
		if(event.keyCode==13 && $(this).val()!="")
		{
			socket.emit("setnickname",{"nick":$(this).val()});
		}
	});
	socket.on("setnickname",function(response){
		if(response.server===true)
		{
			loadhtml("/saladechat/");
			$("#nickname").attr('disabled', 'true');
		}else{
			alert(response.server)
		}
	})
	var loadhtml=function(url)
	{
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			data: {},
		})
		.done(function(html) {
			$("#content").html(html);
			enabledchat();
			getlista();
		})
		.fail(function() {
		
		})
		.always(function() {
			
 		});		
	}
	var mostrarlista=function(listausuarios)
	{
		html="";
		for(var i=0;i<listausuarios.length;i++)
		{
			html+="<li>"+listausuarios[i].nick+"</li>";
		}
		$("#usuarios").html(html);
	}
	var getlista=function()
	{
		socket.emit("get_lista",{});
	}
	var enabledchat=function()
	{
		$("#menvio").keydown(function(event) {
			if(event.keyCode==13)
			{
				socket.emit("mensajes",{"nick":$("#nickname").val(),"msn":$(this).val()})
				$(this).val("");
			}
		});
	}
	socket.on("get_lista",function(response){
		mostrarlista(response.lista);
	});
	socket.on("mensajes",function(response){
		console.log(response);
		$("#mensajes").append("<li>"+response.nick+">"+response.msn+"</li>")
	});
});
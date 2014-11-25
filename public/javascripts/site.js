$(function($){
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
			$("#nickname").attr('disabled','true');
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
			$("#container").html(html);
			enabledchat();
		})
		.fail(function() {
		
		})
		.always(function() {
			
		});
		
	}
});
var contador=10;

function restar(){
	contador=contador-1;
	if(contador==0){
		acabarCuentaAtras();
	}
}

function acabarCuentaAtras(){
	clearInterval(temporizador);//paramos la ejecucion del metodo, indicando la variable creada al final
	alert("¡TIEMPO!");
}

var temporizador=setInterval(function(){restar()},10000); //10s = 10000ms
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

router.get("/registro/",function(req,res){
	res.render('registro',{ title: 'Express'});
});
router.get("/login/",function(req,res){
	res.render("login",{ title: "Express"});
})
router.get("/partidanueva/",function(req,res){
	res.render("partidanueva",{})
})
router.get("/chat/",function(req,res){
	res.render("chat",{})
})
router.get("/saladechat/",function(req,res){
	res.render("saladechat",{title:"Sala"})
})
router.get("/salaespera/P?",function(req,res){
	res.render("salaespera",{title:"Sala"})
})
router.get("/listajugadores/",function(req,res){
	res.render("listajugadores",{title:"Sala"})
})
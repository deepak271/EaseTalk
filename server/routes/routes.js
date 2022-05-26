const express =require('express');
const routes = express.Router();
const controller = require('../controller/controller');


routes.get('/',(req,res)=>{
    res.render('login',{mess:''})
})
routes.get('/signup',(req,res)=>{
    res.render('signup');
})

//API
routes.post('/api/login',controller.validate);
routes.post('/api/adduser',controller.addUser);
module.exports = routes;
const mysql = require('mysql')
const dotenv = require('dotenv').config();
const connect = mysql.createConnection({
    host:'localhost',
    user:process.env.user,
    password:process.env.password,
    database:process.env.dbname
})
connect.connect(function(err){
    if(err)
        console.log(err);
    else
    console.log('connected to db..');
    
})
module.exports=connect;
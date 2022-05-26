const db = require('../db/connection');
const bcrypt =require('bcrypt');
const path = require('path');

 const obj ={
     dbname:'',
     userid:'',
     contactList:[]
 }
const validate= (req,res)=>{
    if(req.body.email==''||req.body.password=='')
    res.redirect('/');
    else{
    let str = 'select * from users where email = ?';
     db.query(str,req.body.email,(err,data)=>{
        if(data.length>0 && req.body.password === data[0].password)
        {   obj.dbname=data[0].name;
            obj.userid=data[0].user_id;
         let str2 = `SELECT conversation.sender_id,conversation.reciever_id,users.name FROM conversation LEFT JOIN users ON conversation.reciever_id = users.user_id
         where conversation.sender_id=?`
         db.query(str2,data[0].user_id,(err,sdata)=>{
            if(err)
            throw err;
            else{
    
            sdata.forEach((val)=>{
                obj.contactList.push(val);
            })
            console.log(obj);
            }
         })
            res.sendFile(path.join(__dirname+'../../../views/index.html'));
        }
        else{
            res.redirect('/')
        }
 
    })
    }
}

const addUser=(req,res)=>{
  if(req.body.userid==''||req.body.name==''||req.body.email==''||req.body.password=='')
  res.redirect('signup');
  else{
  
    //  const salt = await bcrypt.genSalt(10);
    //  const hashpass = await bcrypt.hash(req.body.password,salt);
    //    console.log(hashpass);
    const str = "insert into users(user_id,name,email,password) values (?,?,?,?)";
    db.query(str,[req.body.userid,req.body.name,req.body.email,req.body.password],(err,data)=>{
        if(err)
        throw err;
        else{
            res.send(data);
            console.log(data);
        }
    })
  }
}
const addConversation=(uinfo)=>{
    let sid,rid;
    let str = 'select * from users where email = ?';
    db.query (str,uinfo.newmail,(err,data)=>{
          if(data.length>0)
          {   sid=uinfo.userid;
              rid=data[0].user_id;
    const str = "insert into conversation(sender_id,reciever_id) values (?,?)";
    db.query(str,[sid,rid],(err,data)=>{
        if(err)
        throw err;
        else
        console.log(data);
    })
          }
    })

}
module.exports={
    validate,
    addUser,
    addConversation,
    obj
}
console.log(module.exports);
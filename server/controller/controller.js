const db = require('../db/connection');
const bcrypt = require('bcrypt');
const path = require('path');

const obj = {
    dbname: '',
    userid: '',
    contactList: []
}
const validate = (req, res) => {
    if (req.body.email == '' || req.body.password == '')
        res.redirect('/');
    else {
        let str = 'select * from users where email = ?';
        db.query(str, req.body.email, (err, data) => {
            if (data.length > 0 && req.body.password === data[0].password) {
                obj.dbname = data[0].name;
                obj.userid = data[0].user_id;
                
                setContactList(data[0].user_id);
                res.sendFile(path.join(__dirname + '../../../views/index.html'));
            }
            else {
                res.redirect('/')
            }

        })
    }
}
function setContactList(sid) {
    obj.contactList=[];
    let str2 = `SELECT conversation.sender_id,conversation.reciever_id,users.name FROM conversation LEFT JOIN users ON conversation.reciever_id = users.user_id
         where conversation.sender_id=?`
    db.query(str2, sid, (err, sdata) => {
        if (err)
            throw err;
        else {

            sdata.forEach((val) => {
                obj.contactList.push(val);
            })
            console.log(obj);
        }
    })
}

const addUser = (req, res) => {
    if (req.body.userid == '' || req.body.name == '' || req.body.email == '' || req.body.password == '')
        res.redirect('signup');
    else {

        //  const salt = await bcrypt.genSalt(10);
        //  const hashpass = await bcrypt.hash(req.body.password,salt);
        //    console.log(hashpass);
        const str = "insert into users(user_id,name,email,password) values (?,?,?,?)";
        db.query(str, [req.body.userid, req.body.name, req.body.email, req.body.password], (err, data) => {
            if (err)
                throw err;
            else {
                res.redirect('/');
                //res.send(data);
                console.log(data);
            }
        })
    }
}
const addConversation = (uinfo) => {
    let sid = uinfo.sid;
    let rid = uinfo.rid;
    let str = 'select * from users where user_id = ?';
    db.query(str, rid, (err, data1) => {
        if (data1.length > 0) {
            let str1 = "insert into conversation(sender_id,reciever_id) values (?,?)";
            db.query(str1, [sid, rid], (err, data2) => {
                if (err)
                    throw err;
                else { console.log('user added from search');
                setContactList(sid);
             }
            })
        }
    })

}
module.exports = {
    validate,
    addUser,
    addConversation,
    obj
}
console.log(module.exports);
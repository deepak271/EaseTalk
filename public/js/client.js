const socket = io();

var username;
var userid;
var toid='';
var msg_cnt=0;
var prv_msg=[];

const ele=document.querySelector('.right-menu');
const uname = document.querySelector('.username');
const userCont = document.querySelector('.contacts')
const chatarea=document.querySelector('.chat')
const count = document.querySelector('.count');
const msg = document.querySelector('#msg');
const sendbtn = document.querySelector('#sendmsg');
const addUser = document.querySelector('.butn');
const searchUser=document.querySelector('#search')

socket.emit('new-user-join',username);

socket.on('update-name',(user_obj)=>{
    username=user_obj.dbname;
    userid = user_obj.userid;
    uname.innerHTML=`Welcome <b>${username}(userID-${userid})</b>`
    addContacts(user_obj.contactList);
})

socket.on('user-list',(users)=>{
    showUsers(users);
    count.innerHTML=Object.keys(users).length;
})

socket.on('user-connected',(user)=>{
     joinLeft(user,'joined');
});

socket.on('user-disconnect',(user)=>{
    joinLeft(user,'left');
})

socket.on('msg-send',(obj)=>{
    if(toid==='')
    addMessage(obj,'in')
 })

socket.on('private-msg',(payload)=>{
    console.log('got the private message');
    if(toid!==payload.from)
    {   msg_cnt=msg_cnt+1;``
        const inc=document.querySelector(`div[key='${payload.from}']`);
        inc.innerHTML=payload.user + `<span class="circle">${msg_cnt}</span>`
        prv_msg.push(payload);
    }
    else{
        msg_cnt=0;
        prv_msg.push(payload);
        addMessage(payload,'in');
    }
}) 

socket.on('update-user-list',(arr)=>{
    searchUser.value='';
    console.log(arr);
    addContacts(arr);
})

// event Listners
addUser.addEventListener('click',()=>{
    socket.emit('add-user',{sid:userid,rid:searchUser.value});
})
userCont.addEventListener('click',(e)=>{
    toid=e.target.getAttribute('key');
    console.log(toid);
      if(e.target.classList.contains('contact'))
      { chatarea.innerHTML='';
        let arr  = e.target.innerText.split(' ');
        console.log('arr:'+arr);
        chatarea.innerHTML=`<div class='sending'> <span>Sending To:-${arr[0]}</span></div>`;
      }
      
    let farr= prv_msg.filter((el)=>{
        return (el.to==toid || el.from == toid );
     })
     //console.log(farr);
     farr.sort((a,b)=>{
         let fa=a.time,fb=b.time;
         return fa<fb;   
     })
     console.log(farr);
     farr.forEach((el)=>{
         if(el.to==toid)
         addMessage(el,'out');
         else if(el.to==userid)
         addMessage(el,'in');
     })
  })
  sendbtn.addEventListener('click',()=>{
      console.log('toid before send:'+toid);
      if(toid!=='')
      {
          let payload={
            to:toid,
            from:userid,
            txt:msg.value,
            user:username,
            time:Date.now()
        }       
          socket.emit('private-msg',payload);
          prv_msg.push(payload);
         addMessage(payload,'out');
        console.log('private msg emited');
      }
      else
      {
      let obj={
          user:username,
          txt:msg.value
      }
      if(msg.value!='')
      {
          socket.emit('msg-send',obj);
          addMessage(obj,'out');
      }
    }
      msg.value='';
  })

  //functions
 
 function addContacts(arr){
     console.log(arr);
     userCont.innerHTML='';
     userCont.innerHTML=`<div class='contact' key='' style ="margin-bottom:10px;text-align:center">Group Chat</div>
     <div class='crr-active'>Your Contact Users</div>`
     chatarea.innerHTML=`<div class='sending'> <span>Sending To:-Group Chat</span></div>`;
    arr.forEach((el)=>{
     const div = document.createElement('div');
     div.classList.add('contact');
     div.setAttribute('key',`${el.reciever_id}`);
     div.innerText=el.name;
     userCont.appendChild(div);
    })
 } 

 function joinLeft( user,status){
   const div =document.createElement('div');
   div.classList.add('join');
   var str = `<p><strong>${user}</strong> ${status} the chat</p>`
   div.innerHTML=str;
   chatarea.appendChild(div);
   chatarea.scrollTop=chatarea.scrollHeight;
}

function showUsers(users){
    let elem=document.querySelector('.active');
    elem.innerHTML='';
    var str="";
    for(const key in users)
    {
     str =str+ `<p id="user">${users[key].user_db_name}</p>`
    }
    elem.innerHTML=str;
}

function addMessage(obj,type)
{
    let div = document.createElement('div');
    div.classList.add(`message${type}`);
    var str =`<h5>${obj.user}</h5>
               <p class="message">${obj.txt}</p>`
               div.innerHTML=str;
    chatarea.appendChild(div)   
    chatarea.scrollTop=chatarea.scrollHeight;        
}
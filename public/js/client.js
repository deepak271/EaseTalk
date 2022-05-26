const socket = io();

var username;
const ele=document.querySelector('.right-menu');
const uname = document.querySelector('.username');
const userCont = document.querySelector('.contacts')
const chatarea=document.querySelector('.chat')
const count = document.querySelector('.count');
const msg = document.querySelector('#msg');
const sendbtn = document.querySelector('#sendmsg');

socket.emit('new-user-join',username);

socket.on('update-name',(user_obj)=>{
    username=user_obj.dbname;
    uname.innerHTML=`Welcome <b>${username}</b>`
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
// send msg
  sendbtn.addEventListener('click',()=>{
      console.log('clicked');
      let obj={
          user:username,
          txt:msg.value
      }
      if(msg.value!='')
      {
          socket.emit('msg-send',obj);
          addMessage(obj,'out');
      }
      msg.value='';
  })
  socket.on('msg-send',(obj)=>{
     addMessage(obj,'in')
  })
 
 function addContacts(arr){
     console.log(arr);
     userCont.innerHTML='';
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
     str =str+ `<p id="user">${users[key]}</p>`
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
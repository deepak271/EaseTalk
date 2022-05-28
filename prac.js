const fs=require('fs');
let a=[{
    n:'hi',
    p:0,
    c:'y'
}]


fs.writeFile('./server/text/t.txt',JSON.stringify(a),(err,data)=>{
    console.log(err);
});
let dat;
fs.readFile('./server/text/t.txt','utf8',(err,data)=>{
    //console.log(data);
    dat=data;
    console.log(JSON.parse(dat));
})
//console.log(JSON.parse(dat));

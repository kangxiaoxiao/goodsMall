var http=require("http");
var util=require("util");

let indexPage=null;
http.get("http://m.sunlands.com/16/BJ/pc/ec2tG7/index.html",(res)=>{
  let data="";
  res.on("data",chunk=>{
    data+=chunk;
  })
  res.on("end",()=>{
    console.log("result:"+data);
    indexPage=data;
  })
})


var server=http.createServer((req,res)=>{
  /*var pathname=url.parse(req.url).pathname;
  console.log(pathname.substring(1));
  var content=null;
  fs.readFile(pathname.substring(1),"utf-8",(err,data)=>{
    if(err){
      res.writeHead(404,{
        "Content-Type":"text/html"
      })
      content="Not Found"
    }else{
      res.writeHead(200,{
        "Content-Type":"text/html"
      })
      content=data.toString();
      console.log(content);
    }
    res.end(content);
  });*/
  res.end(indexPage);

})
server.listen(3000,"127.0.0.1",()=>{
  console.log("listen in http://127.0.0.1:3000");
})

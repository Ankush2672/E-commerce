let request = new XMLHttpRequest();
request.open('get','/profilepage');
request.send();

let in1 = document.getElementsByTagName("input");
let img = document.getElementsByTagName("img");

request.addEventListener('load',function(){

    let obj = JSON.parse(request.responseText);
   img[3].src = obj.profilepic;
   in1[1].value = obj.fullname;
   in1[3].value = obj.email;

});

let abc = document.getElementById("file");
abc.addEventListener('change',function(event){
    console.log("in",abc.files);
    img[3].src = URL.createObjectURL(event.target.files[0]);

});
let dia = document.getElementById("dialog1");
let dclose = document.getElementById("diaimg");
reload();

function reload()
{
  let request = new XMLHttpRequest();
  request.open('get','/cartlist');
  request.send();

  request.addEventListener('load',function(){

     let robj = JSON.parse(request.responseText);
     
     let img = document.getElementsByClassName("col-3");

     for(let i=0;i<robj.length;i++)
     {
        for(let j=0;j<img.length;j++){
       if(robj[i].productimg == img[j].children[0].children[0].getAttribute("src"))
       {
          console.log("ok");
          img[j].children[2].children[0].innerHTML = "Inside Cart";
          img[j].children[2].children[0].disabled = true;
       }
      }
     }
     //console.log(img[1].children[2].children[0].innerHTML);
  });
}






function dialogue(event)
{
    
    let data;

    
    let img = event.target.parentNode.parentNode.children[0].children[0].getAttribute("src");
    let obj = {
        key : img
    }

    let request = new XMLHttpRequest();
    request.open('post','/alpha');
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(obj));

    request.addEventListener('load',function(){
      data = JSON.parse(request.responseText);

      dia.children[0].children[0].children[0].innerHTML = data.product;
      dia.children[0].children[1].children[0].src = data.productimg;
      dia.children[0].children[2].children[1].innerHTML = data.price;
      dia.children[0].children[3].children[0].innerHTML = data.description;


      dia.open = true;
    });
 
}
 
document.getElementById("mainlist").addEventListener('click',function(){
dia.open = false;
});

dclose.addEventListener('click',function(){
  dia.open = false;
});


function cart(event)
{
  event.target.disabled = true;
  let img = event.target.parentNode.parentNode.children[0].children[0].getAttribute("src");
  let obj = {
      key : img
  }
  let request = new XMLHttpRequest();
  request.open('post','/beta');
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify(obj));
  request.addEventListener('load',function(){
    event.target.innerHTML = "Inside Cart";
   // event.target.addEventListener('click',viewcart);
   // event.target.disable = false;
      console.log(request.responseText);
  });

}

function viewcart(event)
{
  window.location.href = "/cart";
}

function loadmore(event)
{
  let hello = document.getElementById("hello");
 
  let request = new XMLHttpRequest();
  request.open('get','/add');
  request.send();
  request.addEventListener('load',function(){
   if(request.responseText != "fail")
   {  
      let data1 = JSON.parse(request.responseText);

      for(let i=0;i<data1.length;i++)
      {

        let template = `
          <div>

          </div>
        `

        let mdiv = document.createElement("div");
        mdiv.setAttribute("class","col-3 container");
        let div1 = document.createElement("div");
        let div2 =  document.createElement("div");
        let div3 = document.createElement("div");
        div1.setAttribute("class","row");
        div2.setAttribute("class","row");
        div3.setAttribute("class","row");
        let img1 = document.createElement("img");
        img1.setAttribute("onclick","dialogue(event)");
        let span1 = document.createElement("span");
        let button1 = document.createElement("button");
        let buttton2 = document.createElement("button");
        button1.setAttribute("class","btn btn-primary car");
        button1.setAttribute("onclick","cart(event)");
        button1.innerHTML = "Add to Cart";
        buttton2.setAttribute("class","btn btn-primary");
        buttton2.setAttribute("onclick","dialogue(event)");
        buttton2.innerHTML = "View Detail";
       
        img1.src = data1[i].productimg;
        span1.innerText = "price : Rs. " + data1[i].price;

        div1.appendChild(img1);
        div2.appendChild(span1);
        div3.appendChild(button1);
        div3.appendChild(buttton2);
        mdiv.appendChild(div1);
        mdiv.appendChild(div2);
        mdiv.appendChild(div3);

       hello.appendChild(mdiv);

      }



   }
   else
   {
     event.target.disabled = true;
     event.target.innerHTML = "Empty";
   }

  });

}
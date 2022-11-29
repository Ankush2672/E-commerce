let span = document.getElementsByTagName("span");
let check = document.getElementsByClassName("col-3");
let checkout = document.getElementById("check");

if(check.length==0)
{
    checkout.disabled = true;
}
function increase(event)
{
 let a = event.target.parentNode.previousSibling.previousSibling.children[1].innerText;

 let obj2 = {
    key : event.target.parentNode.parentNode.children[0].children[0].getAttribute("src"),
    qty :  event.target.parentNode.previousSibling.previousSibling.children[1].innerText = parseInt(a) + 1
 }

 let request = new XMLHttpRequest();
 request.open('post','/qtychange');
 request.setRequestHeader('Content-Type','application/json');
 request.send(JSON.stringify(obj2));

 request.addEventListener('load',function(){

if(request.responseText == "ok")
{
    event.target.parentNode.previousSibling.previousSibling.children[1].innerText = parseInt(a) + 1;
}

 });
 
}

function decrease(event)
{
 let a = event.target.parentNode.previousSibling.previousSibling.children[1].innerText;
 if(a!=1)
 {
    let obj2 = {
        key : event.target.parentNode.parentNode.children[0].children[0].getAttribute("src"),
        qty :  event.target.parentNode.previousSibling.previousSibling.children[1].innerText = parseInt(a) - 1
     }
    
     let request = new XMLHttpRequest();
     request.open('post','/qtychange');
     request.setRequestHeader('Content-Type','application/json');
     request.send(JSON.stringify(obj2));
    
     request.addEventListener('load',function(){
    
    if(request.responseText == "ok")
    {
        event.target.parentNode.previousSibling.previousSibling.children[1].innerText = parseInt(a) - 1;
    }
    
     });

 
 }
 else
 {
    itemremove(event);      
 }



 //event.target.parentNode.previousSibling.previousSibling.children[1].innerText = parseInt(a) - 1;
}

function itemremove(event)
{
   let obj = {
    key : event.target.parentNode.parentNode.children[0].children[0].getAttribute("src")};

    let request = new XMLHttpRequest();
    request.open('post','/removeitem');
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(obj));

    request.addEventListener('load',function(){

           if(request.responseText == "ok")
           {
            window.location.href = "/cart";
           }
    });
}

checkout.addEventListener('click',function(){

    let request = new XMLHttpRequest();
    request.open('get','/carter');
    request.send();
    request.addEventListener('load',function(){

      let data = JSON.parse(request.responseText);
      data = data.cart;
       let am = 0;
      for(let i=0;i<data.length;i++)
      {
         am += data[i].price * data[i].quantity;
      }

      let obj = 
      {
        amount : am*100,
        currency : "INR"
      }

      let request2 = new XMLHttpRequest();
      request2.open('post','/checkout');
      request2.setRequestHeader('Content-Type','application/json');
      request2.send(JSON.stringify(obj));

      request2.addEventListener("load",function(){

        let db = JSON.parse(request2.responseText);
      // raxzorpay
        console.log(db);
      var options = {
        "key": "rzp_test_i9a0r0s39GLkW2", // Enter the Key ID generated from the Dashboard
        "amount": "1000000000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Shopify.com",
        "description": "Test Transaction",
        "image": "logo.png",
        "order_id": db.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "callback_url": "/order",
        "prefill": {
            "name": "Ankush Joon",
            "email": "AnkushJoon2672@gmail.com",
            "contact": "8168264094"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
});


    rzp1.open();
    e.preventDefault();


  //razorpay
      });

    });


});
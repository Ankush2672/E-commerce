const express  = require('express');
const Razorpay = require('razorpay');
const fs = require('fs');
const emailsend = require('./module/mail');


const multer  = require('multer')
const upload = multer({ dest: 'profilepic/' })

let count = 5; 
let session = require('express-session');
const { request } = require('http');

const d = new Date();

const app = new express();
const port = 3001;
//razorpay

var instance = new Razorpay({
key_id : "rzp_test_i9a0r0s39GLkW2",
key_secret : "x37aP1YsyBEu1Gwe5OKkT3cl"
});

//razorpay

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');

app.use(express.static('public'));
app.use(express.urlencoded({extended : false}));
app.use(express.static('uploads'));
app.use(express.static('profilepic'));
app.set('view-engine','ejs');
app.use(express.json());
 
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
  }));

  // mongoose start
  const signupuser = mongoose.model('user', {
	username : String,
	password : String,
	fullname : String,
	email : String,
	otp : Number,
	verified : Number,
	profilepic : String,
});

const items  = mongoose.model('product',{
product : String,
productimg : String,
price : Number,
description : String
});

const cartitem = mongoose.model('cart',{

username : String,
cart : Array
});

const cartmodel = mongoose.model('cartdemo',{
product : String,
productimg : String,
price : Number,
description : String,
quantity : Number,
max : Number
});



  //mongoose end

  app.get('/',function(req,res){


    if(req.session.loggedin)
	{
	if(req.session.userdetail.verified == 1)
	{
		
		let arr;
		items.find({},function(err,result){
			arr = result;
			req.session.max = arr.length;
			arr = arr.splice(0,req.session.load);
			  dowork1();
			});
			function dowork1(){
				let obj = arr;
				res.render('./home.ejs',{user : req.session.userdetail,product : obj});};
	}
	else
	{
		// let ab="rty";
		// res.render('./verify.ejs',{user : req.session.userdetail,err : ab});

	}
    }
	else
	{
		let a = "yes";
    	res.render("./login.ejs",{err : a});

	}

  });


  app.get('/verify',function(req,res){
//console.log("home",req.session.loggedin);
if(req.session.loggedin)
{
	if(req.session.loggedin && req.session.userdetail.verified != 1)
	{
		let ab = "abc";
		res.render('./verify.ejs',{user : req.session.userdetail,err : ab});
	}
	else if(req.session.userdetail.verified == 1)
	{
		// let arr;
		// items.find({},function(err,result){
		// 	arr = result;
		// 	arr = arr.splice(0,count);
		// 	  dowork();
		// 	});
		// 	function dowork(){
		// 		let obj = arr;
		// 		res.render('./home.ejs',{user : req.session.userdetail,product : obj});};
		res.redirect('/');
	}
	else
	{
		let a = "yes";
    	res.render("./login.ejs",{err : a});
	}

}
else
{
	res.redirect('/');
}

  });


  app.post('/verify',function(req,res){
	console.log("here",req.session.userdetail);

	signupuser.find({username : req.session.userdetail.username},function(err,result){

		if(req.body.userotp == req.session.userdetail.otp)
		{
			req.session.userdetail.verified = 1;

			signupuser.updateOne({username : req.session.userdetail.username},{verified : 1},function(err,result)
			{
				console.log(result);
				res.redirect('/');
			});
		}
		else
		{
			let a = "no";
			res.render("./verify.ejs",{user : req.session.userdetail,err : a});
	
		}
	});

  });


app.get('/login',function(req,res){

	let a = "yes";
	res.render("./login.ejs",{err : a});
});


app.get('/signup',function(req,res){

	let a = "yes";
		  res.render("./signup.ejs",{err : a});
});

app.post('/login',function(req,res){
	console.log(req.body.username,req.body.password);

	let obj2={
		username : req.body.username,
		password : req.body.password
	}

	signupuser.find(obj2,function(err,result)
		{
            if(result.length!=0)
			{
				console.log("in");
				req.session.loggedin = true;
				req.session.load = 5;
				
			req.session.userdetail = result[0];
			count = 5;
		 	res.redirect('/verify');
			}
			else
			{
				let a = "no";
				res.render("./login.ejs",{err : a});

			}

		});

});

app.post('/signup',function(req,res){
	console.log(req.body.username,req.body.password,req.body.fullname);
	let obj3 = new signupuser();
	obj3.username = req.body.username,
	obj3.password = req.body.password,
	obj3.fullname = req.body.fullname,
	obj3.email = req.body.email,
	obj3.otp = Date.now() % 1000000,
	obj3.verified = 0,
	obj3.profilepic = "user.png"

	emailsend(req.body.email,req.body.fullname,obj3.otp,function abc(err,data){
       console.log("sent");
	   if(err!=null)
	   {
		signupuser.find({username : req.body.username},function(err,result)
		{
			if(result.length==0)
			{
				obj3.save();
				console.log("success");
			 res.redirect('/login');
			}
			else
			{
				console.log("Fail");
		     let a = "no";
		      res.render("./signup.ejs",{err : a});

			}

		});
	}
	else
	{
		let a = "error";
		  res.render("./signup.ejs",{err : a});
	}
	});
  
});


app.get('/logout',function(req,res){
	req.session.destroy();
	count=5;
	res.redirect('/');
});



app.get("/admin2672",function(req,res){

res.sendFile(__dirname + '/admin.html');

});

app.post('/admin2672',upload.single('productimg'),function(req,res){

	let obj2 = {
		product : req.body.product,
		productimg : req.file.filename,
		 price : req.body.price,
		description : req.body.description
	}

product(obj2,'./product.txt',function(err){
	if(err != "no")
	{
      res.redirect('/admin2672');
	}
	else
	{
		res.send("error occured");
	}
})
});

app.get('/add',function(req,res){
//	count = count + 5;

if(req.session.load <= req.session.max)
{

	items.find({},function(err,result){
		arr = result;
		req.session.max = arr.length;
		arr = arr.splice(req.session.load,5);

		req.session.load +=5;
		res.json(arr);

		});
	}
	else
	{
		res.send("fail");
	}
});

app.post('/alpha',function(req,res){
//console.log(req.body,"here");
    items.find({productimg : req.body.key},function(err,result){
        res.json(result[0]);
		return;

	});
    
});

app.get('/profile',function(req,res){

	if(req.session.loggedin)
	{
	
	res.render('./profile.ejs',{user : req.session.userdetail})
	}
	else
	{
		res.redirect('/');
	}

});


app.post('/profilepic',upload.single('profilepic'),function(req,res){

let obj = req.session.userdetail;
if(req.file!=undefined)
{
obj.profilepic = req.file.filename;
// req.session.userdetail.profilepic = obj.profilepic;
}
if(req.body.password != "")
{
  obj.password = req.body.password;
}

signupuser.updateOne({username : obj.username},obj,function(err,result){

	console.log(result);
	res.redirect('/profile');
})

// update(req.session.userdetail,"./database.txt",function(a){
// 	res.redirect('/profile');
//  });

});



app.get('/profilepage',function(req,res){
console.log("in");
	res.json(req.session.userdetail);
});


//cart here pending work

app.post('/beta',function(req,res){

	items.find({productimg : req.body.key},function(err,result){
	   let ab = 	result[0];
      let obj = new cartmodel();
	  
	    obj.product = result[0].product;
		obj.productimg = result[0].productimg;
		obj.price = result[0].price;
		obj.description = result[0].description;
	   obj.quantity = 1;
	   obj.max = Math.floor(Math.random() *6) + 3;

	   let obj2 = new cartitem();
	   obj2.username = req.session.userdetail.username;
	   obj2.cart.push(obj);
	  // console.log(obj2);
	  cartitem.find({username : req.session.userdetail.username},function(err,result){
		if(result.length==0)
		{
			obj2.save();
		}
		else
		{
			cartitem.updateOne({username : req.session.userdetail.username},{$push : {cart : obj2.cart[0]}},function(req,result){
                       console.log(result);


			});
		}


	  });
	

	});




	// alphaget(req.body,'./product.txt',function(obj){

    //    obj.quantity = 1;
	//    obj.max = Math.floor(Math.random() *6) + 3;
    //    // console.log(obj);
	// 	let obj5 = {
	// 		username : req.session.userdetail.username,
	// 		cart : []
	// 	}
    //      obj5.cart.push(obj);
	// 	addcart(obj5,"./cart.txt",function(err){
	// 		if(err == "done")
	// 		{
	// 			res.send("done");
	// 		}

	// 	});

	// 	return;
	// });
  
	
   

});


app.get('/cart',function(req,res){

     if(req.session.loggedin)
	 {
   

	let arr = {},k=1,c=1;;



	cartitem.find({},function(err,data){
			if(data.length>0)
			{

              arr = data;
			}
			else{
				if(k!=9)
			{
			res.render('./cart.ejs',{user : req.session.userdetail,cart2 : arr});
			}
			return;
			}
		    // console.log(arr.length);
		  for(let i =0;i<arr.length;i++)
		  { 
			//console.log(arr[i]);
			if(arr[i].username == req.session.userdetail.username)
			{
                dowork2(arr[i]);
				c=8;
				break;
			}

		  }
		  if(c!=8)
		  {
            res.render('./cart.ejs',{user : req.session.userdetail,cart2 : arr});
		  }
		  
		});
		function dowork2(arr2){
			let obj = arr2;
			res.render('./cart.ejs',{user : req.session.userdetail,cart2 : obj});
			k=9;
		};
	}
	else
	{
		res.redirect('/');
	}

});


app.post('/removeitem',function(req,res){

cartitem.find({username : req.session.userdetail.username},function(err,result){

let arr = result[0].cart;

for(let i=0;i<arr.length;i++)
{
	if(arr[i].productimg == req.body.key)
	{
		arr.splice(i,1);
		break;
	}
}

cartitem.updateOne({username : req.session.userdetail.username},{cart : arr},function(err,result){

console.log(result);
res.send("ok");

});


});


});



//here


app.post('/qtychange',function(req,res){

cartitem.find({username : req.session.userdetail.username},function(err,result){

	let arr = result[0].cart;

	for(let i=0;i<arr.length;i++)
{
	if(arr[i].productimg == req.body.key)
	{
		arr[i].quantity = req.body.qty;
		break;
	}
}

cartitem.updateOne({username : req.session.userdetail.username},{cart : arr},function(err,result){

	console.log(result);
	res.send("ok");
	
	});



});



});

app.get('/cartlist',function(req,res){

cartitem.find({username : req.session.userdetail.username},function(err,data){
let obj = [];
let sobj = [];
if(data.length>0)
{
	obj = data[0];
}

sobj = obj.cart;

res.json(sobj);

});

});

app.get('/carter',function(req,res){
 
	cartitem.find({},function(err,result)
	{
	   for(let i=0;i<result.length;i++)
	   {
		   if(result[i].username==req.session.userdetail.username)
		   {
			 res.json(result[i]);
		   }
	   }
   
   
	}); 
   
   });

   app.post('/checkout',function(req,res){
     
      let params = req.body;
	  instance.orders.create(params).then((data) => {

         res.send({"order" : data,op : "success"});
	  }).catch((errror) => {

        res.send({"order" : errror,op : "fail"});

	  });
   });


   app.post("/order",function(req,res){
        console.log(req.body);


		cartitem.find({username : req.session.userdetail.username},function(err,result){

			let arr = [];
		
		
		cartitem.updateOne({username : req.session.userdetail.username},{cart : arr},function(err,result){
		
			console.log(result);
			res.sendFile(__dirname+'/order.html');
			});
		
		});

       
   });

app.get('*',function(req,res){

res.sendFile(__dirname + '/error.html');
});



app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});
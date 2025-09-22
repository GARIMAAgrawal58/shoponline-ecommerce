const express = require('express');
const app = express();

const session = require('express-session');

app.use(session({
  secret: '1231www@', 
  resave: true,
  saveUninitialized: true
}));




const multer=require('multer')

const st = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, 'ecommerce/uploads/');
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: st });
var bd=require('body-parser');
var ed=bd.urlencoded({extended:true});
app.use(express.static("ecommerce"));
app.use(express.static("ecommerce/uploads"));




app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.locals.aname = req.session.aname;
  res.locals.aemail= req.session.aemail;
  res.locals.uemail= req.session.uemail;
  res.locals.uname= req.session.uname;
  next();
});


app.get("/",function(req,res)
{
	var q="Select * from product";
	con.query(q,function(err,result)
	{
	if(err)
		throw err
res.render("index",{data:result});
})

});
app.get("/index",function(req,res)
{
res.redirect("/");	
});


app.get("/contact",function(req,res)
{

res.sendFile("./ecommerce/contact.html",{root:__dirname});
});
app.get("/login",function(req,res)
{
res.sendFile("./ecommerce/login.html",{root:__dirname});
});
app.get("/about",function(req,res)
{
res.sendFile("./ecommerce/about.html",{root:__dirname});
});
app.get("/register",function(req,res)
{
res.sendFile("./ecommerce/register.html",{root:__dirname});
});
app.get("/admin",function(req,res)
{
res.sendFile("./ecommerce/admin.html",{root:__dirname});
});
var my=require("mysql")
var con=my.createConnection({
host:"127.0.0.1",
user:"root",
password:"",
database:"ecommerce"
})
con.connect(function(err)
{
if(err)
throw err
console.log("connected to mysql")
})
app.post("/registerprocess",ed,function(req,res)
{
var a=req.body.fn;
var b=req.body.ln;
var c=req.body.em;
var d=req.body.pwd;
var e=req.body.rpwd;
var q="insert into Users values('"+a+"','"+b+"','"+c+"','"+d+"')";
con.query(q,function(err,result)
{
if(err)
throw err;
res.send("Data inserted Successfully")
})
});
app.post("/contactdetail",ed,function(req,res)
{
var a=req.body.cfn;
var b=req.body.cln;
var c=req.body.cemail;
var d=req.body.csub;
var e=req.body.cmsg;
var q="insert into contactuser values('"+a+"','"+b+"','"+c+"','"+d+"','"+e+"')";
con.query(q,function(err,result)
{
if(err)
throw err;
res.send("Data inserted Successfully")
})

});

app.post("/loginprocess",ed,function(req,res)
{
	var E=req.body.logemail;
	var P=req.body.logpwd;
	var q="Select * from Users where email='"+E+"'"
	con.query(q,function(err,result)
{
	if(err)
		throw err
	var L=result.length;
	if(L>0)
	{
		if(result[0].password==P)
		{
			req.session.uname=result[0].fname+" "+result[0].lname;
			req.session.uemail=result[0].email;
			res.redirect("/");
			
		}
			else
			res.send("invalid user")
	}
	else
		res.send("email is incorrect")
})
})
app.post("/adminprocess",ed,function(req,res)
{
	var E=req.body.em;
	var P=req.body.pw;
	var q="Select * from admin where email='"+E+"'"
	con.query(q,function(err,result)
{
	if(err)
		throw err
	var L=result.length;
	if(L>0)
	{
		if(result[0].password==P)
		{
			req.session.aemail=result[0].email;
			req.session.aname=result[0].name;

			res.sendFile("./ecommerce/admindashboard.html",{root:__dirname});
		}
		else
			res.send("invalid user")
	}
	else
		res.send("admin email is incorrect")
})
})

app.get("/vusers",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
			var q="Select * from Users"
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.render("vusers",{data:result})
})
	}
})
app.get("/venq",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var q="Select * from contactuser"
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.render("venq",{data:result})
})
	}
})
app.get("/addproducts",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var q="Select * from product"
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.render("addproducts",{data:result})
})
	}
})



app.post("/productprocess",ed,upload.single('productImage'),function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	
var a=req.body.productId;
var b=req.body.productName;
var c=req.body.category;
var d=req.body.quantity;
var e=req.body.price;
var f=req.body.description;
var g=req.file.filename;

var q="insert into product values('"+a+"','"+b+"','"+c+"','"+d+"','"+e+"','"+f+"','"+g+"')";
con.query(q,function(err,result)
{
if(err)
throw err;
res.send("Product added Successfully")
})
	}
});
app.post("/changepassword",ed,function(req,res)
{
	
var em=req.session.aemail;
var a=req.body.P1;
var b=req.body.P2;


var q="update admin set password='"+b+"' where email='"+em+"' and password='"+a+"'";
con.query(q,function(err,result)
{
if(err)
return err;
var r=result.affectedRows;
if(r>0)
	res.send("password is updated")
else
	res.send("something is missing")
})
});



app.get("/vproducts",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var q="Select * from product"
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.render("vproducts",{data:result})
})
}
})
app.get("/setting",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
// 	var q="Select * from admin"
// 	con.query(q,function(err,result)
// {
// 	if(err)
// 		throw err;
	res.render("setting")
// })
}
})
app.get("/deluser",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var e=req.query.em;

	var q="delete from users where email='"+e+"'";
	con.query(q,function(err,result)
{
	
	res.redirect("vusers")
})
	}
})
app.get("/delenq",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var e=req.query.em;

	var q="delete from contactuser where email='"+e+"'";
	con.query(q,function(err,result)
{
	
	res.redirect("venq")
})
}})

app.get("/delproducts",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
	var e=req.query.id;

	var q="delete from product where id='"+e+"'";
	con.query(q,function(err,result)
{
	
	res.redirect("vproducts")
})
}
})
app.get("/logout",function(req,res){
req.session.destroy((err) => {
  res.redirect('admin'); // will always fire after session is destroyed
})


});



app.get("/addcart",function(req,res)
{
	if(req.session.uemail==null)
	
		res.redirect("login");
	
		
	else
	{
	var em=req.session.uemail;
	var un=req.session.uname;
	var id=req.query.pid;
	var pn=req.query.pname;
	var pr=req.query.price;
	var img=req.query.image;

	var qt="Select * from cart where email='"+em+"' and id='"+id+"'";
	con.query(qt,function(err,result)
	{
		if(err)
			throw err;
		var L=result.length;
		if(L>0)
			res.send("Product already added");
		else{
			var q="insert into cart values('"+un+"','"+em+"','"+id+"','"+pn+"','"+pr+"','"+img+"')";
			con.query(q,function(err,result)
		{
			if(err)
				throw err;
			res.send("Product added to cart successfully");
		})
		}
	} )
}
})
app.get("/cart",function(req,res)
{
	if(req.session.uemail==null)
	{
		res.redirect("login");
	}
	else{
		var em=req.session.uemail;
		var q="Select * from cart where email='"+em+"'";
		con.query(q,function(err,result)
	{
		if(err)
			throw err;
		res.render("vcart",{data:result})
	})
	}
})
app.get("/delcart",function(req,res)
{
	if(req.session.uemail==null)
		res.redirect("login")
	else{
	var e=req.query.id;

	var q="delete from cart where id='"+e+"'";
	con.query(q,function(err,result)
{
	// if(err)
	// 	throw err;
	res.redirect("cart")
})
}})
app.get("/shipping",function(req,res)
{
	if(req.session.uemail==null)
		res.redirect("login")
	else{
	res.render("shipping")
	}
})

app.post("/shippingprocess",ed,function(req,res)
{
	if(req.session.uemail==null)
	
		res.redirect("login");
	
		
	else
	{
	var em=req.session.uemail;
	var un=req.session.uname;
	var a=req.body.address; 
	var ph=req.body.phone; 
	var city=req.body.city; 
	var pin=req.body.pincode; 
	var py=req.body.payment; 
	var qt="select pname,price from cart where email='"+em+"'";
	con.query(qt,function(err,result)
	{
var pn="";
var p=0;
for(i=0;i<result.length;i++)
{
	pn=pn+result[i].pname+" ";
	p=p+result[i].price;
}

			var q="insert into orders(name,email,address,phone,city,pincode,payment,pname,amount) values('"+un+"','"+em+"','"+a+"','"+ph+"','"+city+"','"+pin+"','"+py+"','"+pn+"','"+p+"')";
			con.query(q,function(err,result)	
		{
			if(err)
				throw err;
			var qd="delete from cart where email='"+em+"'";
			con.query(qd,function(err,result)
		{
			if(err)
				throw err;
			res.send("Order successfully");
		}
		)
			
		});

});
	

}})
app.get("/vorders",function(req,res)
{
	if(req.session.aemail==null)
		res.redirect("admin")
	else{
			var q="Select * from orders";
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.render("vorders",{data:result})
})
	}
})
app.get ("/delorder", function(req, res){
    if(req.session.aemail==null)
    res.redirect("admin");
else
    {
    let e = req.query.em;
    let q = "delete from orders where pname = '" + e + "'";

    con.query(q,function(err, result){
        res.redirect("vorders")
	})
}
})
app.get("/myorders",function(req,res)
{
	if(req.session.uemail==null)
	
		res.redirect("login");
	
		
	else
	{
		var em=req.session.uemail;
		var q="select * from orders where email='"+em+"'";
		con.query(q,function(err,result)
	{
		if(err) throw err;
	   res.render("myorders",{data:result})
	})
	}
})
app.get("/delmyorder",function(req,res)
{
	if(req.session.uemail==null)
		res.redirect("login")
	else{
	var e=req.query.pc;

	var q="delete from orders where pname='"+e+"'";
	con.query(q,function(err,result)
{
	if(err)
		throw err;
	res.redirect("myorders")
})
}})
app.get("/shop", (req, res) => {
    var q="select * from product";
    con.query(q,function(err,result){
        if(err)throw err;
        res.render("shop",{data:result});

    })
    
});
app.get("/shop-single", (req, res) => {
    var id=req.query.pid;
	


	var q="select * from product where id='"+id+"'";
    con.query(q,function(err,result){
        if(err)throw err;
		console.log("Query Result:", result);
        res.render("shop-single",{data:result});

    })
    
});

app.listen(3000, () => {
	console.log('server listening on port 3000');
});

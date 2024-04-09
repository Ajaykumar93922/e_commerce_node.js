const express = require("express");
const session=require("express-session");
const bodyParser = require("body-parser");
const path = require("path"); // For working with file paths
const app = express();
const port = 3000;

var connection= require("./database.js");

function executeQuery(query, category) {
  return new Promise((resolve, reject) => {
    connection.query(query, category, (err, result) => {
      if (err) {
        console.error(`Error in searching for ${category}:`, err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Set the view engine and views directory
app.set("view engine", "ejs"); // Assuming you want to use EJS as the view engine

app.set("views", path.join(__dirname, "views")); // Specify the views folder path


app.get("/", (req, res) => {
  res.render("login"); 
});

app.get("/login", (req, res) => {
  res.render("login"); 
});

app.get("/register",(req,res)=>{
  res.render("register");
})

app.get("/home", (req, res) => {
  const item1 = "shirts";
  const item2 = "jeans";
  const item3 = "cargos";
  const item4 = "tshirts";
  const query1 = 'SELECT * FROM products WHERE category=?';
  const query2 = 'SELECT * FROM products WHERE category=?';
  const query3 = 'SELECT * FROM products WHERE category=?';
  const query4 = 'SELECT * FROM products WHERE category=?';

  Promise.all([
    executeQuery(query1, item1),
    executeQuery(query2, item2),
    executeQuery(query3, item3),
    executeQuery(query4, item4)
  ])
    .then(([result1, result2, result3, result4]) => {
      res.render("home", { shirts: result1, jeans: result2, cargos: result3, tshirts: result4 });
    })
    .catch((err) => {
      console.error("Error in one of the queries:", err);
      res.status(500).send("Internal Server Error");
    });
});



app.get("/wishlist",(req,res)=>{
  const Userid=req.session.userId;
  const query1 = 'SELECT * FROM wishlist WHERE user_id=?';
  Promise.all([
    executeQuery(query1, Userid)
  ])
  .then(([result1]) => {
    res.render("wishlist", { list: result1});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });

})


app.get("/About",(req,res)=>{
  res.render("About");
})

app.get("/Shipping",(req,res)=>{
  res.render("Shipping_policy");
})

app.get("/Privacy",(req,res)=>{
  res.render("Privacy_policy");
})

app.get("/Cancellation",(req,res)=>{
  res.render("Cancellation_policy");
})

app.get("/Terms",(req,res)=>{
  res.render("Terms_condition");
})

app.get("/place_order",(req,res)=>{
  console.log("Order placed");
  res.redirect("home");
})


app.get("/cart",(req,res)=>{
  const Userid=req.session.userId;
  const query1 = 'SELECT * FROM cart WHERE user_id=?';
  Promise.all([
    executeQuery(query1, Userid)
  ])
  .then(([result1]) => {
    res.render("cart", { list: result1});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/shirts",(req,res)=>{
  const query='SELECT * FROM products WHERE category=?';
  const item="shirts";
  Promise.all([
    executeQuery(query, item)
  ])
  .then(([result]) => {
    res.render("shirts", { shirts: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/tshirts",(req,res)=>{
  const query='SELECT * FROM products WHERE category=?';
  const item="tshirts";
  Promise.all([
    executeQuery(query, item)
  ])
  .then(([result]) => {
    res.render("tshirts", { tshirts: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/jeans",(req,res)=>{
  const query='SELECT * FROM products WHERE category=?';
  const item="jeans";
  Promise.all([
    executeQuery(query, item)
  ])
  .then(([result]) => {
    res.render("jeans", { jeans: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/cargos",(req,res)=>{
  const query='SELECT * FROM products WHERE category=?';
  const item="cargos";
  Promise.all([
    executeQuery(query, item)
  ])
  .then(([result]) => {
    res.render("cargos", { cargos: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})

app.get("/joggers",(req,res)=>{
  const query='SELECT * FROM products WHERE category=?';
  const item="joggers";
  Promise.all([
    executeQuery(query, item)
  ])
  .then(([result]) => {
    res.render("joggers", { joggers: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });
})


app.post("/checkout",(req,res)=>{

  const Userid=req.session.userId;
  const query1 = 'SELECT * FROM cart WHERE user_id=?';
  Promise.all([
    executeQuery(query1, Userid)
  ])
  .then(([result]) => {
    res.render("checkout",{cartItems: result});
  })
  .catch((err) => {
    console.error("Error in one of the queries:", err);
    res.status(500).send("Internal Server Error");
  });


})

app.post("/placeorder",(req,res)=>{
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const order_data={
    user_id:req.session.userId,
    name:req.body.name,
    number:req.body.number,
    email:req.body.email,
    address:req.body.pincode+" "+req.body.flat+" "+req.body.street+" "+req.body.city+" "+req.body.state+" "+req.body.country,
    method:req.body.method,
    total_products:req.body.total_products,
    total_price:req.body.total_price,
    placed_on:day+"/"+month+"/"+year,
    payment_status:"paid"  
  }

  const insertQuery = 'INSERT INTO orders SET ?';
  connection.query(insertQuery,order_data,(err,result)=>{
    if(err){
      console.log("Insertion failed",err);
   //   alert("Insertion failed");
    }
    else{
      console.log("Insertion successful");
      res.redirect("home");
   //   alert("Insertion sucessful");
    }
  });

  console.log("order placed successfully");

})


app.post("/login",(req,res)=>{

    const user_data={
      name:req.body.name,
      email:req.body.email,
      password:req.body.pass
    }

  var c_password=req.body.c_pass;
  if(user_data.password!=c_password){
    console.log("Passwords doesn't match");
    res.redirect("register");
    return;
  }

  const insertQuery = 'INSERT INTO users SET ?';
  connection.query(insertQuery,user_data,(err,result)=>{
    if(err){
      console.log("Insertion failed",err);
      res.redirect("register");
    }
    else{
      console.log("Insertion successful");
      res.render("login");
    }
  });

  //res.render("login");
})

app.post("/log_home",(req,res)=>{
    var flag=0;
    var email=req.body.email;
    var password=req.body.pass;
    const search='SELECT  * FROM users where email=? and password=?';

    connection.query(search,[email,password],(err,result)=>{
      if(err){
        console.log("Error is searching:",err);
      }
      else{
          if(result.length>0){
                console.log("User found");
                req.session.loggedIn = true;
                req.session.userId = result[0].id;
                res.redirect("home");
          }
          else{
            console.log("user not found!");
            res.render("login");
          }
      }
    })

})

app.post("/addToWishlist",(req,res)=>{
  const productId = req.body.productId;
  const query = 'SELECT * FROM wishlist WHERE pid=?';
  const query1='SELECT  * FROM products WHERE id=?';

  Promise.all([
    executeQuery(query,productId)
  ])
  .then(([result])=>{
    if(result.length<=0){
      Promise.all([
        executeQuery(query1, productId)
      ])
        .then(([result1]) => {
          console.log(result1);
    
          const product_data={
            user_id:req.session.userId,
            pid:req.body.productId,
            name:result1[0].name,
            price:result1[0].price,
            image:result1[0].image
          }
          const insertQuery = 'INSERT INTO wishlist SET ?';
          connection.query(insertQuery,product_data,(err,result)=>{
            if(err){
              console.log("Insertion failed",err);
           //   alert("Insertion failed");
            }
            else{
              console.log("Insertion successful");
              res.redirect("home");
           //   alert("Insertion sucessful");
            }
          });
        })
        .catch((err) => {
          console.error("Error in one of the queries:", err);
          res.status(500).send("Internal Server Error");
        });
    }
    else{
      res.redirect("wishlist");
    }
  })


})


app.post("/addToCart", (req, res) => {
  const productId = req.body.productId;
  const userId = req.session.userId;
  console.log(productId,userId)
  const query1 = 'SELECT * FROM products WHERE id = ?';
  const query2 = 'SELECT * FROM cart WHERE user_id = ? AND pid = ?';

  Promise.all([
    executeQuery(query1, productId),
    executeQuery(query2, [userId, productId])
  ])
    .then(([productResult, cartResult]) => {
      if (!cartResult.length) {
        const productData = {
          user_id: userId,
          pid: productId,
          name: productResult[0].name,
          price: productResult[0].price,
          quantity: 1,
          image: productResult[0].image
        };

        const insertQuery = 'INSERT INTO cart SET ?';
        return executeQuery(insertQuery, productData);
      } else {
        const orderQuantity = cartResult[0].quantity + 1;
        const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND pid = ?';

        const updateDetails = {
          quantity: orderQuantity,
          user_id: userId,
          pid: productId
        };


        return executeQuery(updateQuery, [updateDetails.quantity, updateDetails.user_id, updateDetails.pid]);
      }
    })
    .then(() => {
      console.log("Insertion/Update successful");
      res.redirect("home");
    })
    .catch((err) => {
      console.error("Error in one of the queries:", err);
      res.status(500).send("Internal Server Error");
    });
});



app.post("/Removefromcart", (req, res) => {
  const productId = req.body.productId;
  const userId = req.session.userId;

  // Create the DELETE query
  const deleteQuery = "DELETE FROM cart WHERE pid = ? AND user_id = ?";

  // Execute the DELETE query

  Promise.all([
    executeQuery(deleteQuery,[productId, userId])
  ])

    .then(([result]) => {
      console.log("Deletion successful");
      res.redirect("cart");
    })
    .catch((err) => {
      console.error("Error in the query:", err);
      res.status(500).send("Internal Server Error");
    });
});


app.post("/Removefromwishlist", (req, res) => {
  const productId = req.body.productId;
  const userId = req.session.userId;

  // Create the DELETE query
  const deleteQuery = "DELETE FROM wishlist WHERE pid = ? AND user_id = ?";

  // Execute the DELETE query

  Promise.all([
    executeQuery(deleteQuery,[productId, userId])
  ])

    .then(([result]) => {
      console.log("Deletion successful");
      res.redirect("wishlist");
    })
    .catch((err) => {
      console.error("Error in the query:", err);
      res.status(500).send("Internal Server Error");
    });
});


app.listen(port, () => {
  console.log("Server is running at port " + port);
});



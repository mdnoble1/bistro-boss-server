const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crviidq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // database collection 
    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewCollection = client.db("bistroDB").collection("reviews");
    const cartCollection = client.db("bistroDB").collection("carts");



    // get all menu from database 
    app.get('/menu' , async(req, res ) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    // get all reviews from database 
    app.get('/reviews' , async(req, res ) => {
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })


    // get all food cart data from database by querying user email 
    app.get('/carts' , async(req, res ) => {
      const email = req.query.email;
      const query = { email : email }
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })


    // add a food in cart in database 
    app.post('/carts' , async(req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })


    // delete a food from cart 
    app.delete('/carts/:id' , async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Bistro Boss Server Is Running");
});

app.listen(port, () => {
  console.log(`Bistro Boss Is Running On Port: ${port}`);
});

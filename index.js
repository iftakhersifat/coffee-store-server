const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mojyanw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
 
    // from mongo for coffees
    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const userCollection = client.db("coffeeDB").collection("users");

    // users profile
    
    // users to insert into MongoDB
    app.post('/users', async (req, res) => {
    const newProfile = req.body;
    console.log('Users List:', newProfile);
    const profile = await userCollection.insertOne(newProfile)
    res.send(profile)
    });

    // show users in db
    app.get("/users", async(req,res)=>{
    const cursorUser = userCollection.find();
    const showUsers = await cursorUser.toArray();
    res.send(showUsers)

    })

    // for delete users
    app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const resultShow = await userCollection.deleteOne(query);
    res.send(resultShow);
    });

    // single id show
    app.get("/users/:id", async(req, res)=>{
    const id= req.params.id;
    const query = {_id: new ObjectId(id)}
    const resultShow = await userCollection.findOne(query)
    res.send(resultShow)
    });

    //  for update
    app.put("/users/:id", async(req,res)=>{
    const id =req.params.id;
    const filter= {_id: new ObjectId(id)}
    const resultShows = req.body;
    const updateDoc={
      $set: resultShows
    }
    const options ={upsert: true};
    const results=await userCollection.updateOne(filter, updateDoc, options);
    console.log(resultShows)
    res.send(results)
    })

    // for signin
    app.patch("/users", async(req,res)=>{
      const {email, lastSignInTime} =req.body;
      const filter ={email: email}
      const updateDOC ={
        $set: {
          lastSignInTime: lastSignInTime
        }
      }
      const result =await userCollection.updateOne(filter, updateDOC )
      res.send(result)

    })







    // for coffees

    // POST /coffees to insert into MongoDB
    app.post('/coffees', async (req, res) => {
    const newCoffee = req.body;
    console.log('Received coffee:', newCoffee);
    const result = await coffeeCollection.insertOne(newCoffee)
    res.send(result)
    });

    // get data
    app.get("/coffees", async(req,res)=>{
    const cursor = coffeeCollection.find();
    const showResult = await cursor.toArray();
    res.send(showResult)

    })

    // for delete 
    app.delete("/coffees/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const resultShow = await coffeeCollection.deleteOne(query);
    res.send(resultShow);
    });

    // single id show
    app.get("/coffees/:id", async(req, res)=>{
    const id= req.params.id;
    const query = {_id: new ObjectId(id)}
    const resultShow = await coffeeCollection.findOne(query)
    res.send(resultShow)
    })

    //  for update
    app.put("/coffees/:id", async(req,res)=>{
    const id =req.params.id;
    const filter= {_id: new ObjectId(id)}
    const resultShows = req.body;
    const updateDoc={
      $set: resultShows
    }
    const options ={upsert: true};
    const results=await coffeeCollection.updateOne(filter, updateDoc, options);
    console.log(resultShows)
    res.send(results)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } finally {
    // Don't close client if you want to keep server running
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee-store-server');
});

app.listen(port, () => {
  console.log(`coffee-store-server is running on port ${port}`);
});

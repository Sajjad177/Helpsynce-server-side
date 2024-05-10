const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5175"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors({ corsOptions }));
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ak8qibp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    // await client.connect();
    
    const volunteerCollection = client.db("helpSync").collection("volunteers");





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Assignment-11 is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

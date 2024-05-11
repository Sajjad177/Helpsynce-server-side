const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5175", "http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ak8qibp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    // const volunteerCollection = client.db("helpSync").collection("volunteers");
    const db = client.db("helpSync");
    const volunteerCollection = db.collection("volunteers");

    // get all data from db:
    // app.get("/volunteers", async (req, res) => {
    //   const result = await volunteerCollection.find().toArray();
    //   // console.log('get data', result)
    //   res.send(result);
    // });

    //search function get the title:
    app.get("/volunteers", async (req, res) => {
      // const { title } = req.body;
      const { title } = req.query;
      // console.log("The title is", title);
      let query = {};
      if (title) {
        query = {
          title: {
            $regex: new RegExp(title, "i"),
          },
        };
      }
      const result = await volunteerCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    // get all posted by a specific user:
    app.get("/volunteers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "contact.email": email };
      const result = await volunteerCollection.find(query).toArray()
      console.log('specific data',result)
      res.send(result)
    });

    //get a single data fom db:
    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //save a data in db:
    app.post("/volunteer", async (req, res) => {
      const volunteerData = req.body;
      //   console.log(volunteerData);
      const result = await volunteerCollection.insertOne(volunteerData);
      //   console.log(result);
      res.send(result);
    });

    // delete a data :------------------------- 
    app.delete("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Assignment-11 is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

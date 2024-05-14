const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://assignment-11-a2b0e.web.app",
    "https://assignment-11-a2b0e.firebaseapp.com",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  console.log("I am middleware");
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ massage: "Unauthorize access" });
  }
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        return res.status(401).send({ massage: "Unauthorize access" });
      }
      console.log(decoded);
      req.user = decoded;
      next();
    });
  }
};

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

    const db = client.db("helpSync");
    const volunteerCollection = db.collection("volunteers");
    const requestCollection = db.collection("requested");

    //jwt generate:
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Clear token on logout:----------
    app.get("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 0,
        })

        .send({ success: true });
    });

    //search function get the title:
    app.get("/volunteers", async (req, res) => {
      const { title } = req.query;
      let query = {};
      if (title) {
        query = {
          title: {
            $regex: new RegExp(title, "i"),
          },
        };
      }
      const result = await volunteerCollection
        .find(query)
        .sort({ deadline: 1 })
        .toArray();
      res.send(result);
    });

    // get all posted by a specific user:
    app.get("/volunteers/:email", verifyToken, async (req, res) => {
      const tokenEmail = req.user.email;
      const email = req.params.email;

      if (tokenEmail !== email) {
        return res.status(403).send({ massage: "Forbidden Access" });
      }
      const query = { "contact.email": email };
      const result = await volunteerCollection.find(query).toArray();
      // console.log("specific data", result);
      res.send(result);
    });

    //get a single data fom db:
    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // post a request data in db with new collection:---------------
    app.post("/request", async (req, res) => {
      const requestData = req.body;
      const id = req.params.id;
      const volunteerId = new ObjectId(requestData.DataId);
      await volunteerCollection.updateOne(
        { _id: volunteerId },
        {
          $inc: {
            number_Need: -1,
          },
        }
      );
      const result = await requestCollection.insertOne(requestData);
      res.send(result);
    });

    // get a data from new collection in db
    app.get("/request/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await requestCollection.find(query).toArray();
      // console.log("specific data", result);
      res.send(result);
    });

    //get all request user by email in db:
    app.get("/my-volunteerReq/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { organizer_email: email };
      const result = await requestCollection.find(query).toArray();
      res.send(result);
    });

    // delete from new collection:
    app.delete("/my-volunteerReq/:id", async (req, res) => {
      const id = req.params.id;
      console.log("the delete id is--------", id);
      const query = { _id: new ObjectId(id) };
      const result = await requestCollection.deleteOne(query);
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

    app.put("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const volunteerData = req.body;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          ...volunteerData,
        },
      };

      const result = await volunteerCollection.updateOne(
        query,
        updateDoc,
        option
      );
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

const express = require("express");
const cors = require("cors");
require("dotenv").config();
//database
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//connect mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykvad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const movieCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.MOVIE_COLLECTION);
  // perform actions on the collection object
  console.log("db connected");
  //test getting data

  app.get("/searchMovie/:title", (req, res) => {
    const movieName = new RegExp(req.params.title, "gi");
    console.log(movieName);
    movieCollection
      .find({ title: { $regex: movieName } })
      .toArray((err, document) => {
        res.send(document);
      });
  });
  app.post("/addMovie", (req, res) => {
    const newMovie = req.body;
    movieCollection.insertOne(newMovie).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("server is running");
});
const port = 5000;
app.listen(port);

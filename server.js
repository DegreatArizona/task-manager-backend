const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI
var app = express();
const path = require("path");
const allowedOrigins = ["https://task-manager-murex-six.vercel.app"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and other credentials
}));

// Handle preflight requests globally
app.options("*", cors());


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  next();
});


// Parse incoming requests with JSON payloads
app.use(express.json());

// routes
const authRoutes = require("./routes/auths");
const taskRoutes = require("./routes/tasks");
const profileRoutes = require("./routes/profiles")



mongoose.connect(MONGO_URI);
const database = mongoose.connection


database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})



app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);


// var users = [{name:"Tony", id: 1}, {name:"Lisa", id: 2}, {name:"Michael", id: 3},  {name:"Ginger", id: 4}, {name:"Food", id: 5}]
// app.get("/listnames", (req, res, next) => {
//   res.json(users);
// });

// app.get("/listnames/:id", (req, res, next) => {
//   let id = req.params.id
//   let user = users[id]
//   res.json(user);
// });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

require("dotenv").config();
require("./models/User");
require("./models/Note");
require("./services/Passport");

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const notesRouter = require("./routes/notesRoutes");

mongoose.connect(
  process.env.MONGODB_URI,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("database connected");
    }
  }
);

const app = express();

const corsConfig = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsConfig));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    maxAge: 15 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.send("Server working!");
});

app.use("/auth", authRouter);
app.use("/api/v1", notesRouter);

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log("server started on port " + port.toString())
);

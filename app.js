//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');

const app = express();


app.use(express.static(__dirname + '/public/'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

const mongoConnectionString = "mongodb://localhost:27017/cornellus"
mongoose.connect(mongoConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  emailVerified: Boolean
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const postSchema = new mongoose.Schema({
  userid: String,
  title: String,
  keywords: String,
  note_body: String,
  summary: String
});

const Post = new mongoose.model("Post", postSchema);

const adminSchema = new mongoose.Schema({
  totalCounter: Number,
  composeCounter: Number,
  unsignedCounter: Number
});

const AdminSchema = new mongoose.model("AdminSchema", adminSchema);
var adminstats = new AdminSchema({
  totalCounter: 0,
  composeCounter: 0,
  unsignedCounter: 0
});


const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.E_MAIL,
    pass: process.env.E_MAIL_PW
  }
});


app.get("/", function (req, res) {
  var authentic = req.isAuthenticated();
  res.render("home", { alreadyLogged: authentic });
  adminstats.totalCounter += 1;
});

app.get("/about", function(req,res){
  res.render("about");
});


app.get("/statistics/cornstats", function(req,res){
  res.send("Total Count: " + adminstats.totalCounter + " | Compose Count: " + adminstats.composeCounter + " | Unsigned Count: " + adminstats.unsignedCounter);
});

app.get("/gadgets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("gadgets");
    adminstats.totalCounter += 1;
  } else {
    res.redirect("/");
  }
});

app.get("/calculator", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("calculator", { loggedin: true });
    adminstats.totalCounter += 1;
  } else {
    res.render("calculator", { loggedin: false });
    adminstats.totalCounter += 1;
    adminstats.unsignedCounter +=1;
  }
});

app.get("/pomodoro", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("pomodoro", { loggedin: true });
    adminstats.totalCounter += 1;
  } else {
    res.render("pomodoro", { loggedin: false });
    adminstats.totalCounter += 1;
    adminstats.unsignedCounter +=1;
  }
});

app.get("/ruler", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("ruler", { loggedin: true });
    adminstats.totalCounter += 1;
  } else {
    res.render("ruler", { loggedin: false });
    adminstats.totalCounter += 1;
    adminstats.unsignedCounter +=1;
  }
});

app.get("/userhome", function (req, res) {
  if (req.isAuthenticated()) {
    adminstats.totalCounter += 1;
    Post.find({
      userid: req.user.id
    }, function (err, posts) {
      res.render("user-home", {
        usersposts: posts
      });
    });
  } else {
    res.redirect("/");
  }
});

app.get("/compose", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("compose", { loggedin: true });
    adminstats.totalCounter += 1;
    adminstats.composeCounter += 1;
  } else {
    res.render("compose", { loggedin: false });
    adminstats.totalCounter += 1;
    adminstats.composeCounter += 1;
    adminstats.unsignedCounter +=1;
  }
});

app.post("/compose", function (req, res) {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo');
    }, 1000);
  });


  if (req.isAuthenticated()) {
    const post = new Post({
      userid: req.user.id,
      title: req.body.title,
      keywords: req.body.keywords,
      note_body: req.body.notes,
      summary: req.body.summary
    });
    post.save();
    console.log(post);
    myPromise.then(res.redirect("/userhome"));
  } else {
    res.redirect("/login");
  }

});

app.get("/verifySuccesful", function (req, res) {
  res.render("succesfulverify");
});

app.get("/verify/:id", function (req, res) {
  if (req.isAuthenticated()) {
    const filter = { _id: req.user._id };
    const update = { emailVerified: true };
    User.findOneAndUpdate(filter, update, function (err, doc) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/verifySuccesful")
  } else {
    res.redirect("/")
  }
});

//Authentication

app.get("/register", function (req, res) {
  adminstats.totalCounter += 1;
  res.render("register");
});

app.post("/register", function (req, res) {
  const newU = new User({
    email: req.body.email_register,
    username: req.body.username,
    emailVerified: false
  })
  User.register(newU, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate('local')(req, res, function () {
        const options = {
          from: "bugra.gundogan@hotmail.com",
          to: newU.email,
          subject: "Cornellus, verify your email!",
          html: `<h1>Cornellus</h1><h3>In order to verify your email please click the link below:</h3><h5 style="text-decoration:underline; color:dodgerblue; cursor:pointer;" onclick="window.open('http://www.cornellus.com/verify/${newU._id}')">Click here!</h5><a href="cornellus.com/verify/${newU._id}">cornellus.com/verify/${newU._id}</a>`
        };

        transporter.sendMail(options, function (erre, info) {
          if (erre) {
            console.log(erre);
            return;
          } else {
            console.log(info.response);
          }
        });
        res.redirect('/userhome');
      });
    }
  })
});

app.get('/flash', function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/login');
});

app.get("/login", function (req, res) {
  adminstats.totalCounter += 1;
  const errors = req.flash().error || [];
  res.render("login", { errors });
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.send("Wrong username or password.")
    } else {
      passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" })(req, res, function (err) {
        if (err) {
          console.log(err);
          res.send("Wrong username or password.")
        } else {
          res.redirect("/userhome");
        }
      });
    }
  })
});

app.get("/notes/:id", function (req, res) {
  const requestedId = req.params.id;
  adminstats.totalCounter += 1;
  Post.findOne({
    _id: requestedId
  }, function (err, post) {
    var userid = post.userid;
    var username = "";
    User.findOne({
      _id: userid
    }, function (err, user) {
      res.render("readNote", {
        posttitle: post.title,
        postkeywords: post.keywords,
        postbody: post.note_body,
        postAuthor: user.username,
        postSummary: post.summary
      });
      console.log("adfasd" + username);
    });
  });
});

app.get("/deletenote/:id", function (req, res) {
  const requestedId = req.params.id;
  if (req.isAuthenticated()) {
    Post.findOne({
      _id: requestedId
    }, function (err, post) {
      User.findOne({
        _id: post.userid
      }, function (erre, user) {
        if (user._id != req.user.id) {
          console.log("get away you thief!");
          res.redirect("/userhome");
        } else {
          Post.deleteOne({
            _id: requestedId
          }, function (err, post) {
            console.log("deleted.");
            res.redirect("/userhome");
          });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/editnote/:id", function (req, res) {
  const requestedId = req.params.id;
  adminstats.totalCounter += 1;
  if (req.isAuthenticated()) {
    Post.findOne({
      _id: requestedId
    }, function (err, post) {
      if (err) {
        console.log(err);
      } else {
        User.findOne({
          _id: post.userid
        }, function (erre, user) {
          if (user._id != req.user.id) {
            console.log("get away you thief!");
            res.redirect("/userhome");
          } else {
            res.render("editNote", {
              posttitle: post.title,
              postkeywords: post.keywords,
              postbody: post.note_body,
              postAuthor: user.username,
              postSummary: post.summary,
              postid: post._id
            });
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/saveEdited/:id", function (req, res) {
  const requestedId = req.params.id;
  if (req.isAuthenticated()) {
    Post.updateOne({
      _id: requestedId
    }, {
      title: req.body.title,
      summary: req.body.summary,
      note_body: req.body.notes,
      keywords: req.body.keywords
    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("updated.");
      }
    });
    /*Post.updateOne({_id:requestedId},{$set: {title: req.body.title,
       summary: req.body.summary,
       note_body: req.body.notes,
       keywords: req.body.keywords,
       userid: req.user.id
     }
   });*/
    res.redirect("/userhome");
  }
})

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/'); //Can fire before session is destroyed?
});

app.get('/reset/:userid', function (req, res) {
  const errors = req.flash().error || [];
  const userId = req.params.userid;
  res.render("reset", { errors, useriD: userId });
});

app.post('/reset/:userid', function (req, res) {
  const newpass = req.body.password;
  console.log("lüleee");
  User.findOne({ _id: req.params.userid }, function (err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      user.setPassword(newpass, function (erre, user) {
        if (erre) {
          console.log(erre);
        } else {
          user.save();
          console.log("saved.");
          res.redirect("/success");
        }
      });
    } else {
      console.log("No user!");
    }
  });
});

app.get('/success', function (req, res) {
  res.render("success");
})

app.get('/forgot', function (req, res) {
  const errors = req.flash().error || [];
  res.render('forgotten', { errors });
});

app.post('/forgot', function (req, res) {
  const enteredEmail = req.body.email_forgot;
  User.findOne({ email: enteredEmail }, function (err, user) {
    if (err) {
      console.log(err);
    } else if (user) {
      const options = {
        from: "bugra.gundogan@hotmail.com",
        to: enteredEmail,
        subject: "Cornellus, reset your password!",
        html: `<h1>Cornellus</h1><h3>In order to reset your password please click the link below:</h3><a href='cornellus.com/reset/${user._id}'>cornellus.com/reset/${user._id}</a>`
      };

      transporter.sendMail(options, function (erre, info) {
        if (erre) {
          console.log(erre);
          return;
        } else {
          console.log(info.response);
          res.redirect("/login");
        }
      });
    } else {
      const errors = [];
      errors.push("This email is not valid");
      res.render('forgotten', { errors });
    }
  });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});

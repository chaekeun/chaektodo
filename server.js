require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const flash = require("connect-flash");
const crypto = require("crypto");
const util = require("util");
const { create } = require("domain");

app.use(express.static(path.join(__dirname, "myreact/build")));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.COOKIESECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var db;
MongoClient.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("todolist");

    app.listen(process.env.PORT, function () {
      console.log("listening on 8080");
    });
  }
);

const randomBytesPromise = util.promisify(crypto.randomBytes); //salt생성에서는 crypto 모듈의 randomBytes
const pbkdf2Promise = util.promisify(crypto.pbkdf2); //비밀번호 암호화/검증에서는 pbkdf2
const createSalt = async () => {
  const buf = await randomBytesPromise(64);
  return buf.toString("base64");
};

const createHashedPassword = async (password) => {
  const salt = await createSalt();
  const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
  const hashedPassword = key.toString("base64");
  return { hashedPassword, salt };
};

const verifyPassword = async (password, userSalt, userPassword) => {
  const key = await pbkdf2Promise(password, userSalt, 99999, 64, "sha512");
  const hashedPassword = key.toString("base64");

  if (hashedPassword === userPassword) return true;
  return false;
};

//사용자 객체를 세션에 저장할 때 어떻게 저장할지를 정의하는 함수
passport.serializeUser(function (user, done) {
  done(null, user._id); //user._id를 사용자의 식별자로 사용하고 이를 세션에 저장
});
//세션에서 사용자 정보를 어떻게 가져올지를 정의하는 함수
passport.deserializeUser(function (id, done) {
  db.collection("user").findOne({ _id: ObjectId(id) }, (err, result) => {
    //로그인 정보를 받고 데이터베이스를 확인
    done(null, result); //해당 사용자 정보를 요청 객체에 저장(응답헤더에)
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "userid",
      passwordField: "userpw",
      session: true,
      passReqToCallback: false,
    },
    function (userid, userpw, done) {
      db.collection("user")
        .findOne({ userid })
        .then((result) => {
          if (!result) {
            return done(null, false, { message: "Incorrect userid" });
          }

          const verified = verifyPassword(
            userpw,
            result.usersalt,
            result.userpw
          );

          if (verified) {
            return done(null, result);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);

app.post(
  "/api/signin",
  passport.authenticate("local", {
    failureRedirect: "/fail",
    failureFlash: true,
  }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error logging in: ", err);
        res.redirect("/fail");
      } else {
        res.redirect(`/tasks/${req.user._id}`);
      }
    });
  }
);
app.get("/api/fail", (req, res) => {
  res.send(req.flash("error"));
});

app.post("/api/signup", async (req, res) => {
  const result = await createHashedPassword(req.body.userpw);

  db.collection("user").insertOne(
    {
      username: req.body.username,
      userid: req.body.userid,
      userpw: result.hashedPassword,
      usersalt: result.salt,
    },
    (err, result) => {
      res.redirect("/register");
    }
  );
});

app.get("/api/signout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.save(function () {
      res.clearCookie("connect.sid");
      res.redirect("/register");
    });
  });
});

app.get("/api/tasks/:user", async (req, res) => {
  let user_id = req.params.user;
  await db
    .collection("post")
    .find({ writer: ObjectId(user_id) })
    .toArray((err, result) => {
      res.send(result);
    });
});

app.post("/api/complete/:id/:status", (req, res) => {
  const updatedStatus = req.params.status === "true";
  console.log(updatedStatus);
  db.collection("post").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { completed: !updatedStatus } },
    (err, result) => {
      res.send("success to update the status");
    }
  );
});

app.delete("/api/delete/:id", (req, res) => {
  db.collection("post").deleteOne(
    { _id: ObjectId(req.params.id) },
    (err, result) => {
      res.send("successfully delete data in mongodb");
    }
  );
});

app.post("/api/add", (req, res) => {
  db.collection("post").insertOne(
    {
      title: req.body.title,
      content: req.body.content,
      created_at: req.body.created_at,
      writer: req.user._id,
      completed: false,
    },
    (err, result) => {
      res.redirect(`/tasks/${req.user._id}`);
    }
  );
});

app.post("/api/edit", (req, res) => {
  console.log(req.body.taskId);
  db.collection("post").updateOne(
    { _id: ObjectId(req.body.taskId) },
    { $set: { title: req.body.title, content: req.body.content } },
    (err, result) => {
      res.redirect(`/tasks/${req.user._id}`);
    }
  );
});

// 여기서부터 수업내용
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/myreact/build/index.html"));
});

app.get("*", isLogined, (req, res) => {
  res.sendFile(path.join(__dirname, "/myreact/build/index.html"));
});

function isLogined(req, res, next) {
  if (req.user) {
    next();
  } else res.send("not logined");
}

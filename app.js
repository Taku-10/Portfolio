if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const sgMail = require("@sendgrid/mail");
const flash = require("connect-flash");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const session = require("express-session");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.use(session({
  name: "session",
  secret: "ILoveBiscuits",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/about-me", (req, res) => {
  res.render("about.ejs");
})

app.get("/contact-me", (req, res) => {
  res.render("contact.ejs");
})

app.get("/skills", (req, res) => {
  res.render("skills.ejs");
})

app.get("/projects", (req, res) => {
  res.render("projects.ejs");
})

app.post("/contact-me", async(req, res) => {

    const{name, email, message} = req.body;
    const msg = {
      to: process.env.EMAIL_FROM, 
      from: process.env.EMAIL_FROM,
      replyTo: email,
      subject: `New contact submission from ${name}`,
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    }

    await sgMail.send(msg);
    req.flash("success", "Your message has been sent successfully!")
    res.redirect('/contact-me');

  })

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
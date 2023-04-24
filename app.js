if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }


const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs");
})
  

app.post("/contact-me", async(req, res) => {

    const{name, email, message} = req.body;
    const msg = {
      to: process.env.EMAIL_FROM, // replace with your email address
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
    res.redirect('/contact-me');

  })



const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
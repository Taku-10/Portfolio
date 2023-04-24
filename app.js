if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }


const express = require("express");
const app = express();
const path = require("path");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


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



const port = process.env.PORT || 5500
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
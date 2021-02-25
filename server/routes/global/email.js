const router = require("express").Router()
const nodemailer = require("nodemailer")
const smtpTransport = require("nodemailer-smtp-transport")

router.post("/send_email_notification", (req, res) => {
  let { email, message, name } = req.body

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "ralpyosores@gmail.com",
        pass: "climate619",
      },
    })
  )

  let senderName = name ? name : "Anonymous"

  let htmlMessage =
    '<blockquote style="background: #f9f9f9;border-left: 10px solid #ccc;margin: 1.5em 10px;padding: 0.5em 10px;"<p>Message: </p><p style="display: inline;font-weight:bold;">' +
    message +
    "</p><p>From: " +
    senderName +
    "</p><p>Email: " +
    email +
    "</p></blockquote>"
  const mailOptions = {
    from: "WMSU CPE Landing page",
    to: "jigzzawrry@gmail.com",
    subject: "noreply",
    text:
      "Someone has send a message from the landing page. Message " +
      message +
      ", Sender name " +
      senderName +
      ", Email " +
      email,
    html:
      "<h3>Someone has send a message from the landing page</h3>" + htmlMessage,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      res.json({ success: false, msg: "Something went wrong" })
    } else {
      console.log("Email sent: " + info.response)
      res.json({
        success: true,
        msg:
          "Message succesfully sent. Thank you for getting in touch with us.",
      })
    }
  })
})

module.exports = router

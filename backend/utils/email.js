const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    service: "gmail", // Usa Gmail come server SMTP
    auth: {
      user: "m4chtomasz@gmail.com", // Il tuo indirizzo email
      pass: process.env.GMAIL_PASSWORD, // La tua App Password (non la password normale)
    },
  });
  console.log("TRANSPORTER = ", transporter);
  // 2) Define the e mail opti ons
  const mailOptions = {
    from: "Thomas Mach <m4chtomasz@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  // 3) Actually send the mail
  await transporter.sendMail(mailOptions);

  //   const info = await transporter.sendMail(mailOptions);
  //   console.log("Email sent successfully:", info);
};

module.exports = sendEmail;

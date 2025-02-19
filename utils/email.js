const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log("TRANSPORTER = ", transporter);
  // 2) Define the e mail opti ons
  const mailOptions = {
    from: "Thomas Mach <m4chtomasz@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // htmll:
  };
  // 3) Actually send the mail
  await transporter.sendMail(mailOptions);

  //   const info = await transporter.sendMail(mailOptions);
  //   console.log("Email sent successfully:", info);
};

module.exports = sendEmail;

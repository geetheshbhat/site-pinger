const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

const sendEmail =async function main(domain, status, errorMessage) {

  // create reusable transporter object using the default SMTP transport
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: '' // naturally, replace both with your real credentials or an application-specific password
      }
    });
    
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '', // sender address
      to: "", // list of receivers
      subject: "ALERT! pinger", // Subject line
      html: `<h3>${domain}</h3><br><h4><strong>Status</strong>${status}</h4><br><h4><strong>Error Message</strong>${errorMessage}</h4> `,
    });
  } catch (error) {
    console.log(error);
  }
  
}

module.exports={
    sendEmail
}
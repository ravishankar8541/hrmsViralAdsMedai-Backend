const nodemailer = require('nodemailer');
const generatePDF = require('./pdfGenerator');

const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOfferLetter = async (to, offer) => {

  const pdfBuffer = await generatePDF(offer);

  const mailOptions = {
    from: `"Viral Ads Media HR" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Job Offer: ${offer.position} | ${offer.employeeName}`,
    html: `<h2>Congratulations ${offer.employeeName}</h2>`,
    attachments: [
      {
        filename: `Offer_Letter_${offer.employeeName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendOfferLetter;

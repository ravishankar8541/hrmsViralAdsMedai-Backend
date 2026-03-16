const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const generatePDF = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  let y = 780;

  // LOGO
  try {
    const logoPath = path.join(__dirname, '../assets/blackLogo.png');
    const logoImageBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);

    page.drawImage(logoImage, {
      x: 50,
      y: y - 40,
      width: 120,
      height: 40
    });
  } catch (err) {
    console.log("Logo not found");
  }

  // REF + DATE
  page.drawText(`Ref No: ${data.offerId}`, {
    x: 400,
    y: y,
    size: 10,
    font: fontRegular
  });

  page.drawText(`Date: ${new Date().toLocaleDateString('en-IN')}`, {
    x: 400,
    y: y - 15,
    size: 10,
    font: fontRegular
  });

  y -= 80;

  // ADDRESS
  page.drawText(`To,`, { x: 50, y, size: 12, font: fontRegular });
  y -= 20;

  page.drawText(`${data.employeeName}`, { x: 50, y, size: 12, font: fontBold });
  y -= 18;

  if (data.fathersName) {
    page.drawText(`S/O: ${data.fathersName}`, { x: 50, y, size: 12, font: fontRegular });
    y -= 18;
  }

  page.drawText(`${data.address}`, { x: 50, y, size: 12, font: fontRegular });
  y -= 18;

  page.drawText(`${data.phoneNumber}`, { x: 50, y, size: 12, font: fontRegular });
  y -= 18;

  page.drawText(`${data.emailId}`, { x: 50, y, size: 12, font: fontRegular });

  y -= 40;

  // TITLE
  page.drawText(`LETTER OF EMPLOYMENT OFFER`, {
    x: 160,
    y,
    size: 16,
    font: fontBold
  });

  y -= 40;

  // BODY
  const paragraph = `Dear ${data.employeeName},

We are pleased to formally offer you the position of ${data.position} at Viral Ads Media. 
Based on our evaluation of your skills and experience, we are confident that you will make 
significant contributions to our team's creative excellence.

Your employment will begin on ${new Date(data.joiningDate).toLocaleDateString('en-IN')}.

Remuneration: Rs. ${Number(data.salary).toLocaleString('en-IN')} (inclusive of all allowances)
Probation Period: 3 Months
Location: Delhi

You are expected to maintain confidentiality and professional integrity at all times.
All intellectual property created during your tenure remains the property of the company.
`;

  const lines = paragraph.split("\n");

  lines.forEach(line => {
    page.drawText(line, {
      x: 50,
      y,
      size: 12,
      font: fontRegular,
      maxWidth: 500
    });
    y -= 18;
  });

  y -= 40;

  // SIGNATURE
  page.drawText(`Best Regards,`, { x: 50, y, size: 12, font: fontRegular });
  y -= 20;

  page.drawText(`Viral Ads Media`, { x: 50, y, size: 12, font: fontBold });
  y -= 18;

  page.drawText(`HR Department`, { x: 50, y, size: 12, font: fontRegular });

  // FOOTER
  page.drawText(`Viral Ads Media | Digital Creative Agency`, {
    x: 150,
    y: 50,
    size: 10,
    font: fontBold
  });

  page.drawText(`B-27 Budh Vihar Phase 1, New Delhi - 110086`, {
    x: 150,
    y: 35,
    size: 9,
    font: fontRegular
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

module.exports = generatePDF;

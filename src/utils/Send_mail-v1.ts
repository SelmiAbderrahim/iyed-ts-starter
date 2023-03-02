const nodemailer = require('nodemailer');
import ejs from 'ejs';

interface EmailOptions {
  email: string | undefined;
  subject: string;
  message: string;
  template?: string;
}

export const sendEmail = async (options: EmailOptions, html: boolean = false) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: `${process.env.EMAIL_USERNAME}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: '',
  };
  if (!html) {
    transporter.sendMail(mailOptions, (err: any, res: Response) => {
      if (process.env.NODE_ENV === 'development') {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent');
        }
      }
    });
  } else {
    const html = await ejs.renderFile(`${__dirname}/../templates/email/${options.template}.ejs`, {
      // Just give the file name of the template, without the extension
      name: options.email,
    });
    mailOptions.html = html;
    transporter.sendMail(mailOptions, (err: any, res: Response) => {
      if (process.env.NODE_ENV === 'development') {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent');
        }
      }
    });
  }
};
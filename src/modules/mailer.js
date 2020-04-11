const path = require ('path');

const nodemailer = require ('nodemailer');

const hbs = require ('nodemailer-express-handlebars');

const { host, port, user, pass } = require ('../config/mailer.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: 'src/resources/mail/auth',
      layoutsDir: 'src/resources/mail/auth',
    },
    viewPath: 'src/resources/mail/auth',
    extName: '.html',
  };

  transport.use('compile', hbs(handlebarOptions));
  
  module.exports = transport;
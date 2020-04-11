const path = require ('path');

const nodemailer = require ('nodemailer');

const teste = require ('../')

const hbs = require ('nodemailer-express-handlebars');

const { host, port, user, pass } = require ('../config/mailer.json')

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

  console.log(host, port, user, pass);


  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  };
  
  transport.use('compile', hbs(handlebarOptions));

  

  module.exports = transport;
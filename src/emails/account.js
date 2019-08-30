const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: 'psthree@manmadeweb.com',
      subject: 'Thank you for signing up!',
      text: `Welcome to the Task app ${name}, thank you for signing up!`
    })
    .catch(err => {
      console.log(err);
    });
};

const sendCancellationEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: 'psthree@manmadeweb.com',
      subject: 'Sorry that you canceled!',
      text: `Sorry you canceled the Task app ${name}, have a great day!!`
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}

// sgMail
//   .send({

//     // to: 'psthree@aol.com',
//     from: 'psthreex@manmadeweb.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you man.'
//   })
//   .catch(err => {
//     console.log(err);
//   });

// console.log('loaded');
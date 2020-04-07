const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sheetalraghupathi14@gmail.com',
        subject: 'Welcome!',
        text: `Welcome to the app ${name}`
    }).then(() => console.log('Worked').catch(e => console.log(e.message)))
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sheetalraghupathi14@gmail.com',
        subject: 'Sorry!',
        text: `See you again! ${name}`
    }).then(() => console.log('Worked').catch(e => console.log(e.message)))
}


module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
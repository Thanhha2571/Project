const express = require('express')
const nodemailer = require('nodemailer')

module.exports = {
    // randomCode: async() => {
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    //     function generateString(length) {
    //         var result = '';
    //         const charactersLength = characters.length;
    //         for (var i = 0; i < length; i++) {
    //             result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //         }

    //         return result;
    //     }
    //     return generateString(6)
    // },
    sendEmail: async (content, mail) => {
        async function autoSend(content, mail) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'djtimz1411@gmail.com',
                    pass: 'esfryvpkyuykxyzy'
                }
            })
            var mailOptions = {
                from: 'djtimz1411@gmail.com',
                to: mail,
                subject: 'Verify email',
                text: content
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        return autoSend(content, mail)
    }
}
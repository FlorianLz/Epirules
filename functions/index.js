'use strict';

const config = {
    apiKey: "AIzaSyAWYytb3qKxNJkLO_Ed231YVyG7t_jF1gs",
    authDomain: "epirules.firebaseapp.com",
    projectId: "epirules",
}

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const firebase = require('firebase');
firebase.initializeApp(config);

//to make it work you need gmail account
const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;
const db = firebase.firestore();
admin.initializeApp();

//creating function for sending emails
var goMail = function (message,email,prenom,nom) {

//transporter is a way to send your emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });

    // setup email data with unicode symbols
    //this is how your email are going to look like
    const mailOptions = {
        from: 'Epirules <'+gmailEmail+'>',
        to: email, // list of receivers
        subject: 'Nous avons répondu à votre question !', // Subject line
        text: 'Ok !',
        html: `<h3>Bonjour ${prenom} ${nom} !</h3><br /><p>Nous avons répondu à votre question : "${message}".</p>
        <br /><p>Retrouvez la réponse sur l'appli :)</p>` // html body
    };

    //this is callback function to return status to firebase console
    const getDeliveryStatus = function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    };

    //call of this function send an email, and return status
    transporter.sendMail(mailOptions, getDeliveryStatus);
};

//.onDataAdded is watches for changes in database
exports.onDataAdded = functions.firestore.document('/questions/{emailID}').onCreate(function (snap, context) {

    //here we catch a new data, added to firebase database, it stored in a snap variable
    const createdData = snap.data();
    var question = createdData.question;
    var email = createdData.emailDemande;
    var prenom = createdData.prenomDemande;
    var nom = createdData.nomDemande

    if(email){
        goMail(question,email,prenom,nom);
    }
});

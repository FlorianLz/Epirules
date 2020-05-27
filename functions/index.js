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
        html: `<div style="width:100%;height:100%;background-color:#1c1c1c;text-align: center;color:#fff;padding-bottom:40px;font-family: 'Arial', sans-serif;">
        <div style="text-align: center; padding: 1rem 0;border-bottom: 6px solid #56AF32;width:95%;margin:0 auto;">
            <img src="https://firebasestorage.googleapis.com/v0/b/epirules.appspot.com/o/epirules.png?alt=media&token=3108c152-8af3-423d-91df-c3b2f74aea46" alt="Epirules" style="width:20%;">
        </div>
        <p style="color:#fff;font-size:30px;">Merci de l'intéret que vous portez à notre application.</p>
        <div>
            <p style="font-size: 35px;color:#fff;text-align: left;border-bottom:6px solid #56AF32;width: max-content;padding-left:35px;">Rubrique FAQ :</p>
            <div style="width:80%;margin:0 auto;color:#fff;text-align: left;font-size:20px;padding-top:30px;padding-bottom:60px;">
                <p style="text-align:left">Bonjour ${prenom} ${nom},</p>
                <p>Epirules a donné suite à votre question. Vous pouvez retrouver la réponse directement sur le site internet
                    ou l’application. Pour cela, rendez-vous sur <a href="https://epirules.fr" style="text-decoration: none;color:#56AF32">ce lien</a> mais aussi directement sur l’App Store ou le Play
                    Store.</p>
                <p>Nous vous remercions une nouvelle fois de l’intérêt que vous portez à notre application et espérons
                    qu’Epirules vous satisfasse amplement.
                </p>
                <p style="text-align: right">L'équipe Epirules</p>
            </div>
        </div>
        <div style="width:40%;border-top:6px solid #56AF32;font-size:20px;text-align: left;padding-left:30px;">
            <p style="font-style: italic">Un problème ? N’hésitez pas à nous contacter sur
                <b><a style="text-decoration: none;color:#fff" href="mailto:epirules.contact@gmail.com" target="_blank">epirules.contact@gmail.com</a></b></p>
            <div style="display: flex">
                <p>Retrouvez-nous sur</p>
                <a target="_blank" href="https://www.facebook.com/EpirulesOff"><img style="padding-left:20px;" width="65px" height="60px" src="https://firebasestorage.googleapis.com/v0/b/epirules.appspot.com/o/logo-FB.png?alt=media&token=13ce5594-31b0-4b16-9c94-0735d48330c5" alt="Facebook"></a>
                <a target="_blank" href="https://twitter.com/EpirulesOff"><img style="padding-left:20px;" width="65px" height="60px" src="https://firebasestorage.googleapis.com/v0/b/epirules.appspot.com/o/Twitter_Bird.svg.png?alt=media&token=559b41ed-7eed-43ab-98a3-6173d3b153eb" alt="Twitter"></a>
            </div>
        </div>
    </div>` // html body
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

const nodeMailer = require("nodemailer");

const sendEmail = async(options) => {

    const transporter = nodeMailer.createTransport({

        service: "gmail",

        service: process.env.SMPT_SERVICE,    //SMPT -- simple mail transfer protocol(ekhane amra gamil use korbo, config e defined ache)

        auth: {

            user: process.env.SMPT_MAIL,        //SMPT -- mail send hobe ddaayondas@gmail.com theke,  config e defined ache

            pass: process.env.SMPT_PASSWORD,

        },
    });

    const mailOptions = {

        from : process.env.SMPT_MAIL,    // jar theke mail jabe(config e ache, ddaayondas@gmail theke mail jbe)
        to: options.email,               // jar kache mail jabe
        subject: options.subject,        // mail er subject
        text: options.message            // mail text

    };

    await transporter.sendMail(mailOptions);   // mail chole jabe



};

module.exports = sendEmail;
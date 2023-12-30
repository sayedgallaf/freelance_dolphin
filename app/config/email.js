require("dotenv").config();
const Resend = require("resend").Resend
const User = require("../models/userModel")

const resend = new Resend(process.env.RESEND_API_KEY);

const sendToAdmins = async (subject,email) => {
    const adminEmails = (await User.getAdminEmails()).map(e => e.Email)
    for(let a =0; a < adminEmails.length; a++){
        resend.emails.send({
            from: 'system@dolphin.directory',
            to: adminEmails[a],
            subject: subject,
            text: email
        })
    }
}

module.exports = {
    resend,
    sendToAdmins
};
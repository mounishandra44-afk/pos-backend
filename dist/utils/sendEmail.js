"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetEmail = sendResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendResetEmail(to, resetLink) {
    // console.log("this is in the send email functionality")
    // console.log(to)
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: `"Your POS App" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Reset Your Password",
        html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `
    });
}
//# sourceMappingURL=sendEmail.js.map
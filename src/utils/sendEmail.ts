import nodemailer from "nodemailer";

export async function sendResetEmail(to: string, resetLink: string,mainDomain:string) {
  // console.log("this is in the send email functionality")
  // console.log(to)
  const transporter = nodemailer.createTransport({
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
     <h3> this is for the deployed ones</h3>
      <a href="${mainDomain}">${mainDomain}</a>
      <h3>this is for the localhost user</h3>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
}

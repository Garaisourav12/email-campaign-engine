const { Resend } = require("resend");

const sendMail = async ({ to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
};

module.exports = sendMail;

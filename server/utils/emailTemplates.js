const emailTemplates = {
  welcome_email: {
    templateId: "welcome_email",
    name: "Welcome Email",
    getSubject: ({ userName }) => `Welcome to our service, ${userName}!`,
    getBody: ({ userName, campaignId, nodeId }) => `
      <img src=${`${process.env.BASE_URL}/api/templates?event=open&campaignId=${campaignId}&nodeId=${nodeId}`} width="1" height="1" alt="" />
      <p>Hi ${userName},</p>
      <p>We’re thrilled to have you on board. Let’s get started!</p>
    `,
    events: ["open"],
  },

  // reminder_email: {
  //   templateId: "reminder_email",
  //   name: "Reminder Email",
  //   getSubject: ({ userName }) =>
  //     `Reminder: You’ve got something pending, ${userName}`,
  //   getBody: ({ userName, campaignId, nodeId }) => `
  //     <img src=${`${process.env.BASE_URL}/api/templates?event=open&campaignId=${campaignId}&nodeId=${nodeId}`} width="1" height="1" alt="" />
  //     <p>Hello ${userName},</p>
  //     <p>Just a friendly reminder to complete your pending actions.</p>
  //   `,
  //   events: ["open"],
  // },

  offer_email: {
    templateId: "offer_email",
    name: "Offer Email",
    getSubject: ({ userName }) =>
      `Hey ${userName}, check out our exclusive offer!`,
    getBody: ({ userName, campaignId, nodeId }) => `
      <img src=${`${process.env.BASE_URL}/api/templates?event=open&campaignId=${campaignId}&nodeId=${nodeId}`} width="1" height="1" alt="" />
      <p>Hello ${userName},</p>
      <p>We’re excited to share something special with you. Don’t miss out!</p>
    `,
    events: ["open"],
  },

  thankyou_email: {
    templateId: "thankyou_email",
    name: "Thank You Email",
    getSubject: ({ userName }) => `Thank you, ${userName}!`,
    getBody: ({ userName }) => `
      <p>Hi ${userName},</p>
      <p>Thank you for being with us. We truly appreciate your support.</p>
    `,
    events: [],
  },
};

module.exports = emailTemplates;

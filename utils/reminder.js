const { Job, User, Company } = require("../models");
const { fn, col, where } = require("sequelize");
const cron = require("node-cron");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendReminderEmail = async ({ to, subject, text }) => {
  const msg = {
    to,
    from: "abhinav.sharma29032000@gmail.com",
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
  }
};

cron.schedule("01 00 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const reminders = await Job.findAll({
      where: where(fn("DATE", col("followupDate")), today),
      include: [
        {
          model: User,
          attributes: ["email", "name"],
        },
        {
          model: Company,
          attributes: ["company"],
        },
      ],
    });

    for (const reminder of reminders) {
      const user = reminder.user;
      const company = reminder.company;
      if (!user?.email) continue;

      await sendReminderEmail({
        to: user.email,
        subject: `Follow-up Reminder: ${reminder.title} at ${company.company}`,
        text: `Hey ${user.name},\n\nThis is your reminder to follow up on the job "${reminder.title}" at ${company.company}.\n\n– Job Tracker`,
      });
    }
  } catch (err) {
    console.error("Error sending reminders", err);
  }
});

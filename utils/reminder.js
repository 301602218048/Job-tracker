const cron = require("node-cron");
const { Job, User } = require("../models");
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

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const reminders = await Job.findAll({
      where: {
        followupDate: today,
      },
      include: {
        model: User,
        attributes: ["email", "name"],
      },
    });

    for (const reminder of reminders) {
      const user = reminder.User;
      if (!user || !user.email) continue;

      await sendReminderEmail({
        to: user.email,
        subject: `Follow-up Reminder: ${reminder.title} at ${reminder.company}`,
        text: `Hey ${user.name},\n\nThis is your reminder to follow up on the job "${reminder.title}" at ${reminder.company}.\n\n- Job Tracker`,
      });
    }
  } catch (err) {
    console.error("Error sending reminders", err);
  }
});

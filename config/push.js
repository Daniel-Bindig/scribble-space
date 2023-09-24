const cron = require('node-cron');
const webpush = require('web-push');
const { Reminder } = require('../models/reminder');  
const { Op } = require('sequelize');
//const sequelize = require('../database'); 

// Initialize web-push
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Function to send web push notification
function sendNotification(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

function scheduleNotifications() {
  // Cron job for scheduled notifications
  cron.schedule('* * * * *', async () => {
    // Fetch reminders that are due
    const dueReminders = await Reminder.findAll({
      where: {
        reminderTime: {
          [Op.lte]: new Date()  // condition to find reminders that are due
        },
        notificationSent: false,
        isCompleted: false
      }
    });

    dueReminders.forEach((reminder) => {
      const subscription = {
        endpoint: reminder.subscriptionEndpoint,
        keys: reminder.subscriptionKeys
      };

      const payload = {
        title: "Reminder!",
        message: "You have a reminder due!"
      };

      // Send the push notification
      sendNotification(subscription, payload).then(() => {
        reminder.update({ notificationSent: true });
      }).catch(error => {
        console.error("Error sending notification: ", error);
      });
    });
  });
}



module.exports = { scheduleNotifications };

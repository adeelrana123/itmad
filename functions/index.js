const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // make sure to install node-fetch

admin.initializeApp();

const ONESIGNAL_APP_ID = '4f64215b-617b-4fec-a511-2f6b2a25c120';
const ONESIGNAL_API_KEY = 'os_v2_app_j5sccw3bpnh6zjirf5vsujobec4dwiw5kuquruua7bt5lvwmuxie6spexvj66yp4fi5l5lpvej5lpghoretcnsianjpbp42wszt2jai';


exports.notifyUserOnAdminMessage = functions.firestore
  .document("Messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();

    if (message.senderId !== 'admin123') return;

    const userDoc = await admin.firestore().collection('Users').doc(message.receiverId).get();
    const playerId = userDoc.data()?.oneSignalId;

    if (!playerId) {
      console.warn('No OneSignal playerId found for user:', message.receiverId);
      return;
    }

    const notification = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: "Message from Admin" },
      contents: { en: message.text || "You received a new message" },
      data: { chatId: message.chatId || '' }
    };

    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       Authorization: `Bearer ${ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify(notification)
    });

    console.log("✅ OneSignal notification sent.");
  });

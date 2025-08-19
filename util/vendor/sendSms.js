import axios from "axios";

export const sendToSMS = async (to, message) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: "YOUR_TEMPLATE_ID", // ✅ pre-approved DLT template id
        sender: process.env.MSG91_SENDER_ID,
        short_url: "1",
        recipients: [
          {
            mobiles: to, // Format: "91XXXXXXXXXX"
            VAR1: message, // agar template variable hai to use karo
          },
        ],
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("📩 SMS sent:", response.data);
    return true;
  } catch (error) {
    console.error("❌ SMS failed:", error.response?.data || error.message);
    return false;
  }
};

const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "mywhatsapp123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get("/", (req, res) => {
  res.send("WhatsApp bot is live");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Webhook GET called");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.status(403).send("Forbidden");
});

async function sendWhatsAppMessage(to, message) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("WhatsApp Send Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Send message error:", error);
  }
}

app.post("/webhook", async (req, res) => {
  try {
    console.log("Incoming Webhook:");
    console.log(JSON.stringify(req.body, null, 2));

    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (msg) {
      const from = msg.from;
      const text = msg.text?.body?.toLowerCase() || "";

      console.log("Message from:", from);
      console.log("Message text:", text);

      if (text.includes("signup")) {
        await sendWhatsAppMessage(from, "Welcome! Please enter your full name.");
      } else {
        await sendWhatsAppMessage(from, "Hi! Send signup to start registration.");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
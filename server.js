const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN ||  "EAASiiFi3NM4BRs8jsIdTUR7A6Lt4le2qK1zqSkKYgZAChBn7zeRXwHZA3h49X9DhSRKZCIqfgIBViKulFtDXqLGnMUZBfuCrrBc9IQ2f9XvZCXUHvnNi8cUBHEUmuEN31OtN5NmUgCSBvwiEUwkrykZBZC2ux7KMuDNwD2rcAnXZAYp3J1VaBNWHHIDIakJK3sX0ykj1evUfWiZAywM6HvRllZAG5MSpdx70UWNZAQTwAVubCs4pNWDe3NDZCLxRa4Da8gkebguv9RoJtVgsnX30RRR1aOMR";

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive WhatsApp messages
app.post("/webhook", (req, res) => {
  console.log("Incoming Webhook:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
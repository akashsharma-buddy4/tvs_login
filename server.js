

// const VERIFY_VERIFY_TOKEN = process.env.VERIFY_VERIFY_TOKEN || "mywhatsapp123";
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "y8VUWyDeUJkieBkiqSbZJwHO5bpIxctm";

app.post("/webhook", async (req, res) => {

    const data = req.body;

    console.log(data);

    try {

        if (
            data.messages &&
            data.messages[0] &&
            data.messages[0].from_me === false
        ) {

            const chatId = data.messages[0].chat_id;
            const text = data.messages[0].text.body;

            await axios.post(
                "https://gate.whapi.cloud/messages/text",
                {
                    to: chatId,
                    body: "You said: " + text
                },
                {
                    headers: {
                        Authorization: `Bearer ${VERIFY_TOKEN}`
                    }
                }
            );
        }

    } catch(err){
        console.log(err.message);
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Bot Running");
});
const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "montoken123";

// Verification webhook Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Reception des messages WhatsApp
app.post("/webhook", async (req, res) => {
  const body = req.body;
  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (message && message.type === "text") {
      const userMessage = message.text.body;
      const phoneNumber = message.from;
      console.log(`Message reçu de ${phoneNumber}: ${userMessage}`);
      // Réponse Claude arrive ici plus tard
    }
  }
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Serveur démarré sur le port 3000"));

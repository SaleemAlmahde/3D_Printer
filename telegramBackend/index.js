// index.js
const express = require("express");
const axios = require("axios");
const he = require("he"); // npm install he

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

app.post("/sendOrder", async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !message)
    return res.status(400).json({ error: "مفقود chatId أو message" });

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // تحويل الرسالة إلى HTML entities لتفادي أي رموز غريبة
    const safeMessage = he.encode(message);

    await axios.post(url, {
      chat_id: chatId,
      text: safeMessage,
      parse_mode: "HTML", // يسمح بعرض الرموز العربية بشكل صحيح
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "فشل إرسال الرسالة" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

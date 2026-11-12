

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Vikrant AI",
    status: "AI Backend is running"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message required"
      });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "AI token is not configured"
      });
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-4B-Instruct-2507:featherless-ai",
          messages: [
            {
              role: "system",
              content: "You are Vikrant AI, a helpful multilingual assistant. Always reply in the same language as the user. Match the user's tone and explain things clearly."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          stream: false
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Hugging Face error:", response.status, data);
      return res.status(502).json({
        error: "AI provider error. Please try again later."
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "AI returned an empty response"
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Vikrant AI running on port " + PORT);
});

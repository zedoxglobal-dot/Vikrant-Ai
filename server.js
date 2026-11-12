

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// API Home
app.get("/", (req, res) => {
  res.json({
    name: "Vikrant AI API",
    version: "1.0.0",
    status: "online",
    endpoints: [
      "/",
      "/health",
      "/chat",
      "/generate-image"
    ]
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Vikrant AI API is running"
  });
});

// AI Chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key is not configured"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are Vikrant AI, a helpful multilingual AI assistant. Always reply in the same language as the user."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message }]
          }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: data.error?.message || "AI provider error"
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!reply) {
      return res.status(502).json({
        error: "Empty AI response"
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

// Image Generator - Not connected yet
app.post("/generate-image", (req, res) => {
  res.status(501).json({
    status: "not_connected",
    message: "Image generation model will be connected soon."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Vikrant AI API running on port " + PORT);
});

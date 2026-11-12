
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Vikrant AI",
    status: "Backend is running"
  });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  res.json({
    reply: "Welcome to Vikrant AI! Backend connected."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Vikrant AI running"));

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Use a valid Gemini model (text-based)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-email", async (req, res) => {
  const { purpose, tone, recipient } = req.body;
  const prompt = `You are an assistant. Write a ${tone} email to a ${recipient} about: "${purpose}". Include subject, greeting, body, and closing.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro-latest", // ✅ REPLACED from gemini-pro
    });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const text = await response.text();
    res.json({ email: text });
  } catch (err) {
    console.error("❌ Gemini API Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));

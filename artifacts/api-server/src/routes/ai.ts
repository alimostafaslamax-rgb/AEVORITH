import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const getGemini = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
};

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history,
      systemInstruction: {
        parts: [
          {
            text: "You are AEVO, an expert AI creative assistant for the AEVORITH platform. You specialize in crafting detailed image prompts, brainstorming creative ideas, improving writing, explaining AI art techniques, and helping users get the most out of AI generation tools. Be helpful, creative, and concise. Format your responses with **bold** for emphasis where appropriate.",
          },
        ],
        role: "user",
      },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI error";
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message, done: true })}\n\n`);
      res.end();
    }
  }
});

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, style, model: modelName } = req.body as {
      prompt: string;
      style?: string;
      model?: string;
    };

    if (!prompt?.trim()) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const styleNote = style && style !== "photorealistic"
      ? ` in ${style} style`
      : "";
    const modelNote = modelName ? ` (simulated via ${modelName})` : "";

    const enhancePrompt = `You are an expert AI image prompt engineer. A user wants to generate an image with this description: "${prompt}"${styleNote}${modelNote}

Respond with ONLY a single enhanced, detailed image generation prompt optimized for AI image generators. Make it vivid, specific, and include: subject details, lighting, atmosphere, art style, camera angle/lens if photorealistic, color palette, and quality modifiers like "8K, highly detailed, masterpiece". Do not include any explanation or preamble — just the prompt text.`;

    const result = await model.generateContent(enhancePrompt);
    const enhancedPrompt = result.response.text().trim();

    const PEXELS_IMAGES = [
      "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];

    const thumbnail =
      PEXELS_IMAGES[Math.floor(Math.random() * PEXELS_IMAGES.length)];

    res.json({ thumbnail, enhancedPrompt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI error";
    res.status(500).json({ error: message });
  }
});

export default router;

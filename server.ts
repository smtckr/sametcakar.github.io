import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini safely (works in AI Studio and when moved to external hosting with GEMINI_API_KEY)
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route: Single Text Translation
  app.post("/api/translate", async (req: any, res: any) => {
    try {
      const { text, targetLang = "en" } = req.body;
      if (!text || !text.trim()) {
        return res.json({ translation: "" });
      }
      if (targetLang === "tr") {
        return res.json({ translation: text });
      }

      const ai = getAi();
      if (!ai) {
        return res.json({ translation: text });
      }

      const prompt = `You are a professional travel agency localization expert for Cesur Akgün Travel Agency.
Translate the following Turkish text into natural, idiomatic, high-end travel English (similar to luxury travel agencies and global platforms like Viator or GetYourGuide).
Do NOT translate word-by-word. Make it sound native and inviting.
Do NOT translate proper names like "Cesur Akgün", "Cesur Akgün Travel Agency".
Do NOT add quotes or explanations. Return only the translated text.

Turkish text:
${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const translation = response.text?.trim() || text;
      res.json({ translation });
    } catch (error) {
      console.error("Translation error in /api/translate:", error);
      res.json({ translation: req.body.text || "" });
    }
  });

  // API Route: Complete Tour Package Translation (Batch & Structured)
  app.post("/api/translate-tour", async (req: any, res: any) => {
    try {
      const { title, description, location, tag, duration, program, included, excluded, departurePoints, tourConditions } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.json({
          title_en: title || "",
          description_en: description || "",
          location_en: location || "",
          tag_en: tag || "",
          duration_en: duration || "",
          program_en: program || "",
          included_en: included || "",
          excluded_en: excluded || "",
          departurePoints_en: departurePoints || "",
          tourConditions_en: tourConditions || "",
        });
      }

      const prompt = `You are a world-class luxury travel copywriter and translator for Cesur Akgün Travel Agency.
Translate the following Turkish tour details into polished, fluent, and captivating international travel English (as seen on premier platforms like GetYourGuide and luxury tour operators).
Never use literal, word-by-word Google Translate phrasing. Use natural idioms and professional travel terminology.
Keep "Cesur Akgün" as the agency brand name.

Details to translate:
- Title: ${title || ""}
- Description: ${description || ""}
- Location: ${location || ""}
- Tag/Category: ${tag || ""}
- Duration: ${duration || ""}
- Tour Program / Itinerary: ${program || ""}
- Included Services: ${included || ""}
- Excluded Services: ${excluded || ""}
- Departure Points: ${departurePoints || ""}
- Tour Conditions & Rules: ${tourConditions || ""}

Respond ONLY with valid JSON in this exact structure:
{
  "title_en": "translated title",
  "description_en": "translated description",
  "location_en": "translated location",
  "tag_en": "translated category tag",
  "duration_en": "translated duration",
  "program_en": "translated program itinerary",
  "included_en": "translated included services",
  "excluded_en": "translated excluded services",
  "departurePoints_en": "translated departure points",
  "tourConditions_en": "translated tour conditions"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let parsed = {};
      try {
        const rawText = response.text?.trim() || "{}";
        parsed = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("Failed to parse JSON response from Gemini:", parseErr);
      }

      res.json({
        title_en: (parsed as any).title_en || title || "",
        description_en: (parsed as any).description_en || description || "",
        location_en: (parsed as any).location_en || location || "",
        tag_en: (parsed as any).tag_en || tag || "",
        duration_en: (parsed as any).duration_en || duration || "",
        program_en: (parsed as any).program_en || program || "",
        included_en: (parsed as any).included_en || included || "",
        excluded_en: (parsed as any).excluded_en || excluded || "",
        departurePoints_en: (parsed as any).departurePoints_en || departurePoints || "",
        tourConditions_en: (parsed as any).tourConditions_en || tourConditions || "",
      });
    } catch (error) {
      console.error("Translation error in /api/translate-tour:", error);
      res.json({
        title_en: req.body.title || "",
        description_en: req.body.description || "",
        location_en: req.body.location || "",
        tag_en: req.body.tag || "",
        duration_en: req.body.duration || "",
        program_en: req.body.program || "",
        included_en: req.body.included || "",
        excluded_en: req.body.excluded || "",
        departurePoints_en: req.body.departurePoints || "",
        tourConditions_en: req.body.tourConditions || "",
      });
    }
  });

  // API Route: Site Content Translation (Hero & About)
  app.post("/api/translate-site-content", async (req: any, res: any) => {
    try {
      const { section, data } = req.body;
      const ai = getAi();

      if (!ai || !data) {
        return res.json({ data_en: data });
      }

      // Sanitize: Strip out heavy image fields before sending to LLM text prompt
      const textOnlyData: any = { ...data };
      delete textOnlyData.backgroundImage;
      delete textOnlyData.backgroundImages;
      delete textOnlyData.image;

      const prompt = `You are an expert travel agency copywriter for Cesur Akgün Travel Agency.
Translate the following Turkish ${section} section content into elegant, engaging, natural English.
Preserve the brand name "Cesur Akgün Travel Agency". Return strictly JSON.

Input Data:
${JSON.stringify(textOnlyData, null, 2)}

Return a JSON object with the exact same keys but with the English translations as values.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let parsed = data;
      try {
        parsed = JSON.parse(response.text?.trim() || "{}");
      } catch (e) {
        console.error("Failed to parse site content translation JSON:", e);
      }

      res.json({ data_en: parsed });
    } catch (error) {
      console.error("Translation error in /api/translate-site-content:", error);
      res.json({ data_en: req.body.data || {} });
    }
  });

  // Vite middleware setup for Development, static files serving for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use('*', async (req: any, res: any, next: any) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs/promises");
        const templatePath = path.resolve(process.cwd(), "index.html");
        let html = await fs.readFile(templatePath, "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cesur Akgün Server] running on http://localhost:${PORT}`);
  });
}

startServer();

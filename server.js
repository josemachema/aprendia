const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

// Configura OpenAI con tu clave directamente
const openai = new OpenAI({
  apiKey: "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",
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia al puerto de tu React App si es necesario
  })
);
app.use(express.json());

// Ruta para generar actividades
app.post("/generate-activities", async (req, res) => {
  const { prompt } = req.body;
  console.log("Solicitud recibida para generar actividades:", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    // Divide las actividades por líneas y las convierte en un array
    const activities = response.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim() !== ""); // Elimina líneas vacías
    console.log("Actividades generadas:", activities);

    res.json({ activities });
  } catch (error) {
    console.error("Error al generar actividades:", error);
    res.status(500).json({ error: "Error al generar actividades" });
  }
});

// Ruta para el chatbot
app.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  console.log("Mensaje recibido en chatbot:", message);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });

    const reply = response.choices[0].message.content.trim();
    console.log("Respuesta del chatbot:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("Error en el chatbot:", error);
    res.status(500).json({ reply: "Lo siento, hubo un problema al procesar tu solicitud." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

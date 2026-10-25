const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const AI_MODEL = "llama3.2:3b";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const response = await fetch(
            "http://127.0.0.1:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    messages: messages,
                    stream: false
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Ollama could not respond. Check that your model is installed."
            );
        }

        const data = await response.json();

        res.json({
            reply: data.message.content
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error:
                "Could not connect to the AI. Make sure Ollama is running and the model is installed."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Neural AI Studio is running at http://localhost:${PORT}`);
});
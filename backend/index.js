import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

console.log("API Key loaded:", process.env.REMOVE_BG_API_KEY ? "YES" : "NO");

app.post("/api/edit", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }

        const imageBuffer = req.file.buffer;
        const apiKey = process.env.REMOVE_BG_API_KEY?.trim();

        if (!apiKey) {
            return res.status(500).json({
                error: "API key not configured. Get a free one at remove.bg/api",
            });
        }
        const formData = new FormData();
        formData.append("image_file", imageBuffer, "image.png");
        formData.append("size", "auto");
        formData.append("format", "auto");

        const removeResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-API-Key": apiKey,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        if (!removeResponse.ok) {
            const error = await removeResponse.json();
            console.error("Remove.bg error:", error);
            throw new Error(
                `Remove.bg failed: ${error.errors?.[0]?.title || removeResponse.statusText}`
            );
        }

        const buffer = await removeResponse.buffer();
        const resultBase64 = buffer.toString("base64");

        res.json({ imageBase64: resultBase64 });
    } catch (err) {
        console.error("Error in /api/edit:", err.message);
        res.status(500).json({
            error: err.message || "Something went wrong!",
        });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

export default async function handler(req, res) {
    const { prompt, imageGeneration, n, size } = req.body;

    try {
        const apiUrl = imageGeneration
            ? "https://api.openai.com/v1/images/generations"
            : "https://api.openai.com/v1/chat/completions";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            },
            body: JSON.stringify(
                imageGeneration
                    ? { prompt, n, size }
                    : {
                          model: "gpt-3.5-turbo",
                          messages: [{ role: "user", content: prompt }],
                          max_tokens: maxTokens || 500, // Default to 500 if not provided
                          temperature: temperature || 0.5,
                      }
            ),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: "Failed to process the request" });
    }
}


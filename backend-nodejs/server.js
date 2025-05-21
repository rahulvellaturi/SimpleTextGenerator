const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

//  Hardcode your API key here.  This is NOT recommended for production.
const openai = new OpenAI({
  apiKey:
    "sk-1234567890"//Add your actual API key
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

async function generateText(prompt) {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    console.log("Full OpenAI Response:", JSON.stringify(response, null, 2)); // Log the entire response
    console.log("Response Data:", response.data); // Log response.data
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to communicate with OpenAI API");
  }
}

app.post("/generate", async (req, res) => {
  const { task, prompt } = req.body;

  if (!task || !prompt) {
    return res.status(400).json({ error: "Task and prompt are required" });
  }

  let promptInput;
  if (task === "story idea") {
    promptInput = `Generate a short story idea about ${prompt}.`;
  } else if (task === "joke") {
    promptInput = `Tell me a joke about ${prompt}.`;
  } else if (task === "summary") {
    promptInput = `Summarize the following text in one sentence: ${prompt}`;
  } else {
    return res.status(400).json({ error: "Invalid task" });
  }

  try {
    const output = await generateText(promptInput);
    res.json({ result: output });
  } catch (error) {
    console.error("Error in /generate route:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to generate text" }); // Send an error response to the client
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

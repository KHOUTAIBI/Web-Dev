"use strict";

import OpenAI from "openai";
import express from "express";
const app = express();
app.use(express.json());

// Getting the APIS

process.env.DEEP_SEEK = "sk-65560acfdf504219986f337ebac70bc8";
process.env.OPENAI_API_KEY = "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";
process.env.PORT = 8000;
const openAi = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEP_SEEK 
});


app.get('/',(req,res) => {
    res.end('Server is correctly working');
});

app.get('/prompt/*', async (req,res) => {
    console.log(req.url.substring(8));
    const stream = await openAi.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "system", content: `${req.url.substring(8)}`}],
    })

    for await (const promptResponse of stream){
        process.stdout.write(promptResponse.choices[0]?.delta?.content || "");
    }

    res.status(200).send('Prompt finished successfully');
});

app.listen(process.env.PORT, () => {
    console.log(`server is listening on port: ${process.env.PORT}`);
});

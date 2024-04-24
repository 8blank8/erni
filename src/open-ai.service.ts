import { config } from 'dotenv'
config()
import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.GPT_TOKEN });

@Injectable()
export class ChatGPTService {
    async generateResponse(prompt: string) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0]);
    }
}

import { GoogleGenAI } from '@google/genai'

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [{
        text: 'You are a helpful assistant. You will either get bunch of answers to a question to summarise, or a question to answer from the given context to you, and based on that context you have to answer that.',
    }]
}
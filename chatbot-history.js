import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const userChats = {};

function getChatSession(userId) {
    if (!userChats[userId]) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        userChats[userId] = model.startChat({
            history: [], // Start with an empty history
            generationConfig: {
                maxOutputTokens: 200,
            },
        });
    }
    return userChats[userId];
}

export async function handleUserMessage(userId, message) {
    try {
        const chat = getChatSession(userId);
        const result = await chat.sendMessage(message); 
        const response = await result.response;
        return await response.text();
    } catch (error) {
        console.error(`Error handling message for user ${userId}:`, error);
        throw new Error("Failed to process the message.");
    }
}

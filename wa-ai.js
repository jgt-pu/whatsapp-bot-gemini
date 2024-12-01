import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
// import { generateAnswer } from './basic-chatbot.js'; // Import the AI function wo History
import { handleUserMessage } from './chatbot-history.js'; // Import the AI function with History

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body == 'Hallo') {
        msg.reply('Hallo my name is Zootopia');
    }
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    if (msg.body.startsWith('!echo ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    }
    if (msg.body === '!mediainfo' && msg.hasMedia) {
        msg.reply("I am sorry. I am just answering a text based chat.");
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
   }

    // Generate response using AI based on the message content
    if (msg.body.startsWith('!ai ')) {
        try {
            const userPrompt = msg.body.slice(4);
            const aiResponse = await generateAnswer(userPrompt);
            msg.reply(aiResponse);
        } catch (error) {
            console.error(error);
            msg.reply('Sorry, I encountered an error while processing your request.');
        }
    }

    // Generate response with history
    if (msg.body.startsWith('!ai ')) {
        try {
            const userId = msg.from; 
            const userMessage = msg.body; 
            const aiResponse = await handleUserMessage(userId, userMessage);
            msg.reply(aiResponse); 
        } catch (error) {
            console.error("Error processing message:", error);
            msg.reply("Sorry, I encountered an error while processing your message.");
        }
    }
});

client.initialize();

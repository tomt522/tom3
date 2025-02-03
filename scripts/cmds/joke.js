 // Command: Joke (!joke)
function sendJokeCommand(senderId) {
    const jokes = [
        "Why don’t skeletons fight each other? They don’t have the guts!",
        "What do you call fake spaghetti? An impasta!",
        "Why don’t scientists trust atoms? Because they make up everything!"
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    sendMessage(senderId, randomJoke);
}

// Default Response for Unknown Commands
function sendDefaultMessage(senderId) {
    const message = "🤖 Unknown command. Type !help to see available commands.";
    sendMessage(senderId, message);
}

// Send Message to User via Facebook API
function sendMessage(recipientId, messageText) {
    axios.post(https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}, {
        recipient: { id: recipientId },
        message: { text: messageText }
    })
    .then(() => console.log(Message sent to ${recipientId}: ${messageText}))
    .catch(error => console.error("Unable to send message:", error.response ? error.response.data : error.message));
}

// Start the Server
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
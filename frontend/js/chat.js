document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Scroll to bottom of chat automatically
    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to add a message to the UI
    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('d-flex', 'w-100', 'mt-2', 'animate-slide-up');

        if (sender === 'user') {
            msgDiv.classList.add('user-msg');
            msgDiv.innerHTML = `
                <div class="chat-bubble p-3 shadow-sm">${text}</div>
            `;
        } else {
            msgDiv.classList.add('bot-msg');
            msgDiv.innerHTML = `
                <div class="icon-circle bg-blue-light text-teal me-2 shadow-sm flex-shrink-0" style="width: 35px; height: 35px;"><i class="bi bi-robot"></i></div>
                <div class="chat-bubble p-3 shadow-sm">${text}</div>
            `;
        }

        chatBox.appendChild(msgDiv);
        scrollToBottom();
    }

    // Handle sending message and talking to the REAL backend
    async function handleSend() {
        const text = userInput.value.trim();
        if (text === '') return;

        // 1. Show User Message
        appendMessage('user', text);
        userInput.value = '';

        // 2. Show a "Typing..." indicator temporarily
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('d-flex', 'bot-msg', 'w-100', 'mt-2');
        typingDiv.id = typingId;
        typingDiv.innerHTML = `
            <div class="icon-circle bg-blue-light text-teal me-2 shadow-sm flex-shrink-0" style="width: 35px; height: 35px;"><i class="bi bi-robot"></i></div>
            <div class="chat-bubble p-3 shadow-sm text-muted"><em>Typing...</em></div>
        `;
        chatBox.appendChild(typingDiv);
        scrollToBottom();

        // 3. THE REAL BACKEND CONNECTION
        try {
            const token = localStorage.getItem('token'); 
            
            // NOTE: Change this to '/api/chatbot/ask' when you deploy to Render!
            const API_URL = '/api/chatbot/ask'; 

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Only send authorization if a token exists
                    'Authorization': token ? `Bearer ${token}` : '' 
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // 4. Remove typing indicator and show the true AI response
            document.getElementById(typingId).remove();
            appendMessage('bot', data.reply);

        } catch (error) {
            console.error("Chatbot Fetch Error:", error);
            document.getElementById(typingId).remove();
            appendMessage('bot', "Connection error. Please make sure the backend server is running.");
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
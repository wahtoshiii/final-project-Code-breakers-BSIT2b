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

    // Mock AI Logic based on the Code-breakers Proposal
    function generateBotResponse(userText) {
        const text = userText.toLowerCase();

        // 1. Navigation / Map Queries
        if (text.includes('where') || text.includes('map') || text.includes('location') || text.includes('building')) {
            return "You can easily find buildings, offices, and shops using the <strong>Interactive Campus Map</strong> tab below! If you need a specific office, like the IT Department, it's near the main quad.";
        }
        
        // 2. Marketplace / Food / Products
        if (text.includes('food') || text.includes('order') || text.includes('buy') || text.includes('shop') || text.includes('market')) {
            return "Looking for something to buy? Check out the <strong>Student Marketplace</strong> tab. You can order products, meals, and supplies directly from Entrep students there!";
        }

        // 3. Walkthroughs / Facilities
        if (text.includes('preview') || text.includes('look') || text.includes('inside') || text.includes('facility')) {
            return "Want to see what an establishment looks like before visiting? Head over to the <strong>Explore</strong> tab for our Establishment Walkthroughs.";
        }

        // 4. Status / Open Hours
        if (text.includes('open') || text.includes('closed') || text.includes('status') || text.includes('time')) {
            return "Our Real-time Status Tracker is active! Currently, most academic buildings are <strong>Open</strong>, and the Student Marketplace is accepting orders.";
        }

        // 5. General Greetings
        if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
            return "Hello there! How can I assist you with your day at Bicol University Polangui?";
        }

        // 6. Default Fallback
        return "I'm still learning, but I'm here to help you navigate BUP! You can ask me about campus locations, student shops, or facility status.";
    }

    // Handle sending message
    function handleSend() {
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

        // 3. Simulate network delay, then respond
        setTimeout(() => {
            document.getElementById(typingId).remove();
            const response = generateBotResponse(text);
            appendMessage('bot', response);
        }, 1000); // 1 second delay
    }

    // Event Listeners
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
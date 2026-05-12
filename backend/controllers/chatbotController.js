const Product = require('../models/Product');
console.log("🧠 SMART BOT IS RUNNING!");

// 1. The Knowledge Base (The Answers)
const knowledgeBase = {
    requirements: {
        student: "To enroll, please bring your Form 138, Good Moral Certificate, and PSA Birth Certificate to the Registrar.",
        visitor: "Visitors must leave a valid ID at the main gate guardhouse to receive a visitor's pass.",
        teacher: "Faculty requirements and clearances are processed at the HR office in the main Admin building."
    },
    navigation: {
        general: "You can find all locations on our Interactive Map! Let me know which specific building or office you are looking for.",
        library: "The library is located in the Education Department Building.",
        student_council: "The Office of the Student Council is located beside the Education Department Building.",
        inditers: "The Inditers (school publishing organization) office is located beside the Education Department Building.",
        nstp: "The NSTP (National Service Training Program) office is located beside the Education Department Building.",
        csd: "The Computer Studies Department (CSD) is located on the second floor of Computer Studies & Engineering Building.",
        engineering: "The Engineering Department is located on the ground floor of Computer Studies & Engineering Building."
    },
    greetings: "Hello! I am your Campus Service Hub Assistant. I can help you find establishments, check real-time statuses, or answer BUP FAQs.",
    fallback: "I didn't quite catch that. Try asking about a specific department (like CSD or Engineering), requirements, or food availability!"
};

// 2. The Keyword Dictionary (The Brain)
// We map arrays of trigger words to their specific responses.
const intents = [
    { name: 'greeting', words: ['hi', 'hello', 'hey', 'help', 'morning', 'afternoon'], type: 'static', weight: 1 },
    { name: 'requirements', words: ['requirements', 'enroll', 'admission', 'enter', 'pass', 'id'], type: 'role_based', weight: 10 },
    { name: 'nav_library', words: ['library', 'books', 'read'], type: 'static', weight: 10 },
    { name: 'nav_student_council', words: ['council', 'ssc', 'student council', 'president'], type: 'static', weight: 10 },
    { name: 'nav_inditers', words: ['inditers', 'publishing', 'newspaper', 'journalism'], type: 'static', weight: 10 },
    { name: 'nav_nstp', words: ['nstp', 'rotc', 'cwts', 'national service'], type: 'static', weight: 10 },
    { name: 'nav_csd', words: ['csd', 'computer', 'it', 'bsit', 'programming', 'second floor'], type: 'static', weight: 10 },
    { name: 'nav_engineering', words: ['engineering', 'engineer', 'ground floor'], type: 'static', weight: 10 },
    { name: 'nav_general', words: ['where', 'location', 'map', 'find', 'navigate', 'building'], type: 'static', weight: 1 },
    { name: 'status_food', words: ['food', 'curry', 'eat', 'hungry', 'curryalait', 'buy', 'stock'], type: 'database', weight: 10 }
];

// 3. The Smart Logic
const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userRole = req.user ? req.user.role : 'visitor'; 
        
        // Sanitize the input: lower case, remove punctuation, split into an array of words
        const cleanMessage = message.toLowerCase().replace(/[^\w\s]|_/g, "");
        const userWords = cleanMessage.split(' ');

        // Score the intents
        let highestScore = 0;
        let bestIntent = null;

        intents.forEach(intent => {
            let score = 0;
            intent.words.forEach(word => {
                if (cleanMessage.includes(word)) {
                    // THE FIX: Add the weight (10) instead of just 1!
                    score += intent.weight; 
                }
            });

            // If this intent has the highest score, it becomes the top choice
            if (score > highestScore) {
                highestScore = score;
                bestIntent = intent;
            }
        });

        let responseText = "";

        // 4. Generate response based on the winning intent
        if (highestScore === 0 || !bestIntent) {
            responseText = knowledgeBase.fallback;
        } 
        else if (bestIntent.name === 'greeting') {
            responseText = knowledgeBase.greetings;
        } 
        else if (bestIntent.name === 'requirements') {
            responseText = knowledgeBase.requirements[userRole] || knowledgeBase.requirements.visitor;
        }
        else if (bestIntent.name.startsWith('nav_')) {
            // Extracts the specific location string (e.g., 'nav_csd' becomes 'csd')
            const locationKey = bestIntent.name.split('_')[1];
            responseText = knowledgeBase.navigation[locationKey] || knowledgeBase.navigation.general;
        }
        else if (bestIntent.name === 'status_food') {
            const product = await Product.findOne({ name: /Curry/i });
            if (product && product.stock > 0) {
                responseText = `Yes! We currently have ${product.stock} orders of CurryalaIT in stock.`;
            } else {
                responseText = "I just checked the Real-time Status Tracker, and it looks like that item is currently out of stock or the shop is closed.";
            }
        }

        res.status(200).json({ reply: responseText });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ reply: "My circuits are crossing! I'm having trouble connecting right now." });
    }
};

module.exports = { handleChatMessage };
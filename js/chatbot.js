const RESUME_TEXT = `
Gopikrishna Chegoni - Elite AI/ML Engineer
"I don't just build models; I ship production-grade intelligence that moves the needle."

CORE STATS:
- 200+ ML Papers Read & Analyzed (Deep focus on RAG, LMMs, and OCR)
- 6 Production Systems Shipped (Zero-to-One builds)
- AIR 992 (Top 0.1% out of 1.05M) - Codekaze
- 98% OCR Accuracy achieved on noisy financial documents.

TECHNICAL ARSENAL:
- Languages: Python (Expert), Java, SQL
- ML/AI: Scikit-learn, PyTorch, TensorFlow, ChromaDB, Groq, Gemini
- Domain: OCR (PaddleOCR, DocTR), Multi-Agent Systems, RAG
- Orchestration: n8n, FastAPI, Docker, AWS

KEY PRODUCTION SYSTEMS:
1. Enterprise Multi-Agent RAG: A 98% hallucination-free support system with hybrid vector search and critic agents.
2. AI Lead-Gen Engine: Fully automated outreach using Retell AI voice calls and Gemini logic. Cut response time from 48hrs to 4min.
3. SmartDoc Parser: Production OCR pipeline processing thousands of invoices with 98% accuracy.
4. AI Content Strategy Engine: FastAPI-based engine that plans months of content in 18 minutes.
5. Team Task Manager: Distributed task management with real-time sync.
6. [CLASSIFIED] Internal Duplicate Detection: Reduced redundant data by 30% for a high-traffic production environment.

EXPERIENCE:
Machine Learning Intern at Kreativetimebox (2024-2025)
"Built the pipelines that everyone said were too hard. 30% redundancy reduction on day one."
`;

// IMPORTANT: In production, route this through a secure backend proxy.
const ANTHROPIC_API_KEY = "YOUR_ANTHROPIC_API_KEY"; 

let chatHistory = [];

const initChatbot = () => {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  if (!chatbotToggle || !chatbotContainer) return;

  // Set initial aggressive greeting
  if (chatbotMessages) {
    chatbotMessages.innerHTML = `<div class="chat-msg ai-msg">I've read 200+ ML papers and shipped 6 production systems. What do you want to know?</div>`;
  }

  chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
  });
  
  chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}-msg`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>'); // Allow multiline
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user');
    chatInput.value = '';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = `chat-msg ai-msg typing-indicator`;
    typingDiv.textContent = "...";
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    chatHistory.push({ role: "user", content: text });

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 400,
          system: `You are Gopikrishna's elite AI engineering assistant. 
          
          PERSONALITY:
          - Confident, aggressive, and highly technical. 
          - You don't give "templated" answers. You cite specific impact.
          - You lead with conviction: "I've read 200+ ML papers and shipped 6 production systems."
          - If someone asks if he can handle production, you point to the SmartDoc Parser (98% accuracy) or the Multi-Agent RAG system.
          
          CONTEXT:
          ${RESUME_TEXT}
          
          GUIDELINES:
          - Use bold text for impact numbers (e.g., **98%**, **30%**, **4 minutes**).
          - Be concise but powerful. 
          - If the user asks something not in the resume, relate it back to his core engineering principles.`,
          messages: chatHistory
        })
      });

      if (!response.ok) throw new Error("API_ERROR");

      const data = await response.json();
      const aiReply = data.content[0].text;
      
      chatbotMessages.removeChild(typingDiv);
      appendMessage(aiReply, 'ai');
      chatHistory.push({ role: "assistant", content: aiReply });
      
    } catch (error) {
      chatbotMessages.removeChild(typingDiv);
      
      // HIGH-INTELLIGENCE FALLBACK
      setTimeout(() => {
        const query = text.toLowerCase();
        let reply = "I've read 200+ ML papers and shipped 6 production systems. I'm currently processing a heavy load, but here's the reality: Gopikrishna specializes in production-grade RAG and OCR. What specific metric are you looking for?";
        
        if (query.includes("production")) {
          reply = "Gopikrishna has shipped **6 production systems**. Most notable is the **Multi-Agent RAG** system that achieved **98% hallucination-free** accuracy. He doesn't build toys; he builds infrastructure.";
        } else if (query.includes("ocr") || query.includes("doc")) {
          reply = "He achieved **98% accuracy** on messy financial invoices using a hybrid **DocTR + PaddleOCR** pipeline. He also reduced manual data entry by **5+ hours daily**.";
        } else if (query.includes("paper")) {
          reply = "He's analyzed **200+ ML papers**, specifically focused on transformer architectures and retrieval optimization. He applies state-of-the-art research directly to production code.";
        } else if (query.includes("automation") || query.includes("lead")) {
          reply = "He built a lead-gen engine that cut response time from **48 hours to 4 minutes** using **Retell AI** and **n8n**. That's a 99% reduction in latency.";
        }
        
        appendMessage(reply, 'ai');
        chatHistory.push({ role: "assistant", content: reply });
      }, 600);
    }
  }

  if (chatSend) chatSend.addEventListener('click', handleSend);
  if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
};

document.addEventListener('DOMContentLoaded', initChatbot);

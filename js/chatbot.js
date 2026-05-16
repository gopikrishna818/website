const RESUME_TEXT = `
Gopikrishna Chegoni
Aspiring AI/ML Engineer
Email: chegoni.gk@gmail.com | Phone: +91-8184835291
GitHub: github.com/gopikrishna818 | LinkedIn: linkedin.com/in/gopikrishnachegoni
Location: Hyderabad, India

EDUCATION
B.Tech in Computer Science (Data Science), Guru Nanak Institutions Technical Campus (2020 - 2024), CGPA: 8.42
Intermediate (MPC), Narayana Junior College (2018 - 2020), CGPA: 9.78

EXPERIENCE
Machine Learning Intern at Kreativetimebox (Sept 2024 - Sept 2025)
- Built duplicate detection pipeline reducing redundancy by 30%
- Designed & integrated REST APIs to streamline data flow
- Implemented PaddleOCR to extract structured text from documents

PROJECTS
1. AI Lead-Gen & Outreach Automation Engine: n8n workflow with Retell AI voice calls and Gemini-generated outreach.
2. SmartDoc Parser: DocTR & PaddleOCR for invoice/bank statement extraction with 98% accuracy.
3. AI Content Strategy Engine: Full-stack FastAPI + TypeScript app for AI-driven content planning.
4. Team Task Manager: Collaborative task management system with FastAPI and PostgreSQL.
5. Enterprise Multi-Agent RAG: Production-grade support system with hybrid RAG and guardrails.

SKILLS
Python, Java, SQL, Machine Learning (Scikit-learn, PyTorch, TensorFlow), OCR (PaddleOCR, DocTR), n8n, REST APIs, Git, AWS.

ACHIEVEMENTS
- Codekaze AIR 992 (Top 0.1% out of 1.05M applicants)
- NPTEL Python for Data Science Certified (73%)
`;

// IMPORTANT: Do not expose production API keys in client-side code.
// For a real production deployment, this call should be routed through a backend (e.g. serverless function)
// to protect the key and handle CORS.
const ANTHROPIC_API_KEY = "YOUR_ANTHROPIC_API_KEY"; // Replace with your actual key or backend endpoint
const API_URL = "https://api.anthropic.com/v1/messages"; // Use proxy if calling from browser due to CORS

let chatHistory = [];

const initChatbot = () => {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  if (!chatbotToggle || !chatbotContainer) return;

  chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
  });
  
  chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}-msg`;
    msgDiv.textContent = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage(text, 'user');
    chatInput.value = '';
    
    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = `chat-msg ai-msg typing-indicator`;
    typingDiv.textContent = "...";
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    chatHistory.push({ role: "user", content: text });

    try {
      // In a real environment with direct Anthropic API, CORS will block this.
      // Assuming a proxy or serverless function is used here.
      // If using a proxy, change API_URL to the proxy endpoint.
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerously-allow-browser": "true" // Required for client-side calls
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          system: `You are Gopikrishna's resume assistant. Here is his full resume: ${RESUME_TEXT}. Answer questions accurately and naturally based ONLY on this resume. Be concise, professional, and friendly.`,
          messages: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error("API response error");
      }

      const data = await response.json();
      const aiReply = data.content[0].text;
      
      chatbotMessages.removeChild(typingDiv);
      appendMessage(aiReply, 'ai');
      chatHistory.push({ role: "assistant", content: aiReply });
      
    } catch (error) {
      console.error(error);
      chatbotMessages.removeChild(typingDiv);
      
      // Fallback if API fails or is not configured
      setTimeout(() => {
        const query = text.toLowerCase();
        let fallbackResponse = "I'm having trouble connecting to my AI brain right now. Please email Gopikrishna at chegoni.gk@gmail.com!";
        
        if (query.includes("experience") || query.includes("intern")) {
          fallbackResponse = "Gopikrishna worked as a Machine Learning Intern at Kreativetimebox, building duplicate detection pipelines and OCR systems.";
        } else if (query.includes("project")) {
          fallbackResponse = "He has built SmartDoc Parser, AI Lead-Gen Engine, and Multi-Agent RAG systems.";
        } else if (query.includes("skill")) {
          fallbackResponse = "His technical skills include Python, ML (Scikit-learn, PyTorch, TensorFlow), OCR (PaddleOCR, DocTR), and tools like n8n, REST APIs.";
        }
        
        appendMessage(fallbackResponse, 'ai');
        chatHistory.push({ role: "assistant", content: fallbackResponse });
      }, 500);
    }
  }

  if (chatSend) {
    chatSend.addEventListener('click', handleSend);
  }
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
};

document.addEventListener('DOMContentLoaded', initChatbot);

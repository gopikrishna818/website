import os
import glob
import re

directory = r"c:\Users\admin\Downloads\pp"
files = glob.glob(os.path.join(directory, "*.html"))

css = """
  /* ── RAG CHATBOT ── */
  .chatbot-toggle {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(26,107,255,0.4);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .chatbot-toggle:hover {
    transform: scale(1.1) translateY(-5px);
  }

  .chatbot-container {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 350px;
    height: 500px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
  }
  .chatbot-container.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .dark-mode .chatbot-container {
    background: rgba(26,26,26,0.85);
  }

  .chatbot-header {
    padding: 16px 20px;
    background: var(--accent);
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chatbot-title {
    font-weight: 600;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chatbot-close {
    background: none;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.8;
  }
  .chatbot-close:hover { opacity: 1; }

  .chatbot-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chat-msg {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.5;
  }
  .ai-msg {
    background: rgba(0,0,0,0.05);
    color: var(--text);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .dark-mode .ai-msg {
    background: rgba(255,255,255,0.08);
  }
  .user-msg {
    background: var(--accent);
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .chatbot-input {
    padding: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
  }
  .chatbot-input input {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid var(--border);
    border-radius: 100px;
    background: transparent;
    color: var(--text);
    font-size: 13px;
    outline: none;
  }
  .chatbot-input button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 600px) {
    .chatbot-container {
      width: 90%;
      right: 5%;
      bottom: 90px;
    }
    .chatbot-toggle {
      bottom: 20px;
      right: 20px;
    }
  }
"""

html = """
  <!-- RAG Resume Chatbot -->
  <div class="chatbot-container" id="chatbotContainer">
    <div class="chatbot-header">
      <div class="chatbot-title">
        <i class="fas fa-robot"></i> Resume AI
      </div>
      <button class="chatbot-close" id="chatbotClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chat-msg ai-msg">Hi! I'm Gopikrishna's AI assistant. Ask me anything about his experience, skills, or projects.</div>
    </div>
    <div class="chatbot-input">
      <input type="text" id="chatInput" placeholder="Ask about OCR, Python, etc..." />
      <button id="chatSend"><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>

  <button class="chatbot-toggle" id="chatbotToggle">
    <i class="fas fa-comment-dots"></i>
  </button>
"""

js = """
  <script>
  // Chatbot Logic
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbotContainer');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  if(chatbotToggle) {
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

    function handleSend() {
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      chatInput.value = '';
      
      // Smart RAG response
      setTimeout(() => {
        const query = text.toLowerCase();
        let response = "";
        
        if (query.includes("experience") || query.includes("work") || query.includes("intern")) {
            response = "Gopikrishna worked as a Machine Learning Intern at Kreativetimebox (Sept 2024 - Sept 2025). He built a duplicate detection pipeline reducing redundancy by 30%, designed REST APIs, and implemented PaddleOCR for automating data extraction.";
        } else if (query.includes("project") || query.includes("portfolio") || query.includes("smartdoc") || query.includes("lead")) {
            response = "He has two main projects: 1) 'SmartDoc Parser' using DocTR & PaddleOCR for extracting data from invoices/bank statements with 98% accuracy. 2) 'AI Lead-Gen & Outreach Automation Engine' integrating n8n, Retell AI, and Gemini for automated lead qualification.";
        } else if (query.includes("skill") || query.includes("technology") || query.includes("stack") || query.includes("python") || query.includes("java")) {
            response = "His technical skills include Python, Java, SQL, Machine Learning (Scikit-learn, PyTorch, TensorFlow), OCR (PaddleOCR, DocTR), and tools like n8n, REST APIs, Git, and AWS.";
        } else if (query.includes("education") || query.includes("degree") || query.includes("college") || query.includes("university") || query.includes("btech") || query.includes("cgpa")) {
            response = "He holds a B.Tech in Computer Science (Data Science) from Guru Nanak Institutions Technical Campus (2020-2024) with an 8.42 CGPA, and completed his Intermediate at Narayana Junior College with a 9.78 CGPA.";
        } else if (query.includes("ocr") || query.includes("document") || query.includes("parser") || query.includes("paddleocr") || query.includes("doctr")) {
            response = "He has strong expertise in OCR! He built 'SmartDoc Parser' using DocTR and PaddleOCR to extract structured data from invoices and bank statements with 98% accuracy, completely eliminating third-party API dependencies.";
        } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("hire") || query.includes("number")) {
            response = "You can reach Gopikrishna at chegoni.gk@gmail.com or call him at +91-8184835291. He's based in Hyderabad and his GitHub is github.com/gopikrishna818.";
        } else if (query.includes("achieve") || query.includes("rank") || query.includes("certif") || query.includes("nptel")) {
            response = "He secured All India Rank 992 in the Codekaze Naukri Engineers Week Test (out of 1.05M applicants) and holds a Python for Data Science Certification from NPTEL IIT Madras.";
        } else if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("greetings")) {
            response = "Hello! I'm Gopikrishna's AI assistant. You can ask me about his experience, skills, projects, education, or contact info based on his resume.";
        } else if (query.includes("who are you") || query.includes("what are you") || query.includes("your name")) {
            response = "I am an AI assistant built to answer questions about Gopikrishna Chegoni's portfolio and resume. Feel free to ask about his skills, education, or projects!";
        } else {
            response = "Based on his resume, I don't have the exact answer to that, but Gopikrishna is a passionate AI/ML Engineer with strong skills in Python, OCR, and data pipelines. Would you like to know about his projects or experience?";
        }
        
        appendMessage(response, 'ai');
      }, 600);
    }

    if(chatSend) {
      chatSend.addEventListener('click', handleSend);
    }
    if(chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }
  </script>
"""

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "chatbot-container" in content:
        continue # already injected
        
    # Inject CSS
    content = content.replace("</style>", css + "\n</style>")
    
    # Inject HTML
    if "<script" in content:
        # Find first script block at the end (usually before </body>)
        content = re.sub(r'(<script)', html + r'\n\1', content, count=1)
    else:
        content = content.replace("</body>", html + "\n</body>")
        
    # Inject JS
    content = content.replace("</body>", js + "\n</body>")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")

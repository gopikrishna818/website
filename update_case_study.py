import re

with open('case_study_ocr.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<title>.*?</title>', '<title>Krectivetimebox OCR Case Study</title>', content)

new_main = """
  <main>
    <div class="page-title">
      <div class="section-tag">Case Study</div>
      <h1>Krectivetimebox OCR Pipeline</h1>
      <p>Intelligent document duplicate detection system using PaddleOCR and image hashing.</p>
    </div>

    <div class="bento-grid">
      <!-- Image Card -->
      <div class="project-card featured" style="grid-column: span 12; padding: 0;">
        <img src="ocr_architecture.png" alt="Architecture Diagram" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; border-radius: var(--radius);" />
      </div>

      <!-- Problem Statement -->
      <div class="project-card" style="grid-column: span 6; grid-row: span 2;">
        <div class="proj-title">The Challenge</div>
        <div class="proj-desc">
          Handling thousands of documents daily with varying degrees of duplication. Slight variations in scans, lighting, and angles made simple hashing ineffective. Manual annotation and deduplication were consuming massive resources and time.
        </div>
      </div>

      <!-- The Solution -->
      <div class="project-card project-card-blue" style="grid-column: span 6; grid-row: span 2;">
        <div class="proj-title">The Solution</div>
        <div class="proj-desc">
          An advanced pipeline integrating <strong>PaddleOCR</strong> for robust text extraction combined with perceptual image hashing. This hybrid approach allowed us to identify semantic duplicates even when visual artifacts differed, scaling horizontally across containerized instances.
        </div>
      </div>

      <!-- Architecture Breakdown -->
      <div class="project-card project-card-dark" style="grid-column: span 12; grid-row: span 2;">
        <div class="proj-title">System Architecture</div>
        <div class="proj-desc">
          <ul style="list-style-position: inside; margin-top: 10px; line-height: 1.8;">
            <li><strong>Ingestion Layer:</strong> FastAPI REST endpoints handling high-throughput asynchronous document uploads.</li>
            <li><strong>Processing Nodes:</strong> Celery workers executing PaddleOCR text detection & recognition along with perceptual hashing (pHash) generation.</li>
            <li><strong>Data Persistence:</strong> PostgreSQL with specialized indexing for quick similarity lookups on extracted hashes and text metadata.</li>
            <li><strong>Annotation Workflow:</strong> Integrated labeling UI allowing human-in-the-loop verification for low-confidence scores, reducing manual efforts by 40%.</li>
          </ul>
        </div>
      </div>
      
      <!-- Metrics & Outcomes -->
      <div class="project-card project-card-cream" style="grid-column: span 12; grid-row: span 2;">
        <div class="proj-title">Key Outcomes</div>
        <div class="proj-desc" style="display: flex; gap: 40px; margin-top: 20px; flex-wrap: wrap;">
          <div>
            <h2 style="font-size: 48px; color: var(--accent); font-family: 'Bebas Neue', sans-serif;">94.2%</h2>
            <p style="font-weight: 600; opacity: 0.7;">Overall Accuracy</p>
          </div>
          <div>
            <h2 style="font-size: 48px; color: var(--accent); font-family: 'Bebas Neue', sans-serif;">40%</h2>
            <p style="font-weight: 600; opacity: 0.7;">Reduction in Manual Effort</p>
          </div>
          <div>
            <h2 style="font-size: 48px; color: var(--accent); font-family: 'Bebas Neue', sans-serif;">96.5%</h2>
            <p style="font-weight: 600; opacity: 0.7;">Recall on Duplicates</p>
          </div>
        </div>
      </div>
    </div>
  </main>
"""

content = re.sub(r'<main>.*?</main>', new_main, content, flags=re.DOTALL)

with open('case_study_ocr.html', 'w', encoding='utf-8') as f:
    f.write(content)

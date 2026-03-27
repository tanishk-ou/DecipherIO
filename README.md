# Decipher.io

**A Gift for Creative Thinkers.** Decipher.io is an AI-powered accessibility platform and browser extension designed to make reading and learning effortless for neurodivergent individuals, specifically those with dyslexia, ADHD, or visual processing challenges.

By combining advanced OCR, AI text simplification, high-fidelity Text-to-Speech (TTS), and evidence-based visual aids, Decipher.io transforms complex documents and web pages into highly personalized, easily digestible formats.

**Experience the Live App:** [decipheriovercel.vercel.app](https://decipheriovercel.vercel.app)
*(Note: Full features, including the Community Review database, are fully configured and active on the live deployment).*

---

## Core Features

### AI-Powered Text Simplification
* **Adaptive Difficulty:** Users can set the reading level to Mild, Moderate, or Severe. The backend utilizes Google's **Gemini AI** to rewrite complex academic jargon or convoluted sentences into plain, understandable language.
* **Auto-Language Detection & Translation:** Seamlessly supports **English and Hindi**. Upload a document in either language, and the AI will auto-detect, translate, and synthesize the output based on the user's preference.
* **Hallucination Checking (NLI):** Uses on-the-fly Natural Language Inference (`Xenova/transformers`) to cross-reference the AI's simplified text against the original source, flagging any potential hallucinations or inaccuracies with a color-coded "Confidence Score."

### Visual Accessibility Tools
* **Dyslexia-Friendly Typography:** Integrated support for specialized fonts like *OpenDyslexic* and *Atkinson Hyperlegible*.
* **Bionic Reading Mode:** Synthetically emboldens the first few letters of words to guide the eyes and improve reading speed.
* **Irlen Syndrome Overlays:** Customizable, semi-transparent colored overlays (Rose, Peach, Blue, etc.) to reduce visual stress and screen glare.
* **Sentence Focus Mode:** Highlights the currently active sentence while dimming the rest of the text to prevent users from losing their place.
* **Custom Text Formatting:** Users can selectively highlight, bold, italicize, and color-code specific segments of the text.

### Multimodal Learning & Audio
* **High-Fidelity TTS:** Integrated with **Google Cloud Text-to-Speech** providing natural-sounding, bilingual voices (Journey/Studio/Standard) with adjustable playback speed.
* **Interactive Speechbot:** A built-in, voice-activated AI tutor. Users can click the microphone and ask questions about the text they are reading (e.g., "Can you summarize this paragraph?"). The bot understands mixed "Hinglish" audio inputs and responds via voice in the user's target language.

### Smart PDF Generation
* **Export Your Layout:** Users can export the simplified text, maintaining their custom highlights, font choices, and Bionic Reading preferences, into a clean, standalone PDF using `jsPDF`.

### Community & Collaboration
* **Community Reviews:** A dedicated space where users can share, review, and rate simplified documents or custom AI settings. *(Note: Requires Supabase configuration for local development).*
---

## Architecture & Tech Stack

**Frontend (Web & Extension):**
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS & Shadcn/UI
* **Icons:** Lucide-React
* **PDF Processing:** `pdfjs-dist` & `jspdf`

**Backend (API Routes):**
* **LLM Engine:** Google Generative AI (`gemini-2.5-flash`, `gemini-3-flash-preview`, `gemini-2.0-flash`, `gemini-2.5-flash-lite`)
* **Audio Synthesis:** Google Cloud TTS (`@google-cloud/text-to-speech`)
* **Local NLI Model:** Hugging Face Transformers via `Xenova` (`nli-deberta-v3-xsmall`)
* **Image OCR:** Gemini Vision API & `tesseract.js`
* **PDF Parsing:** `pdf-parse`

---

## Getting Started

### Prerequisites
You will need Node.js installed, along with API keys for Google Gemini and Google Cloud Platform (for TTS).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/decipher-io.git](https://github.com/yourusername/decipher-io.git)
   cd decipher-io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   GOOGLE_CLIENT_EMAIL="your_gcp_service_account_email"
   GOOGLE_PRIVATE_KEY="your_gcp_private_key"

   # Supabase (Required ONLY for Community Review features)
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
   ADMIN_PASSWORD="your_custom_admin_password"
   ```

4. **Community Reviews & Database Setup (Optional):**
   Decipher.io uses "Graceful Degradation" for its database features. If you do not configure Supabase, the core AI and accessibility tools will still work perfectly on your local machine, and the Community Review UI will safely hide itself.
   
   If you want to run the **Community Review** section locally, create your own Supabase project with a matching table schema, and add your keys to the `.env.local` file. The app will automatically detect the keys and enable the feature.

   *If you do not want to configure Supabase, and see this feature in action without setup, visit the [Live Deployment](decipheriovercel.vercel.app).*

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 💼 Business Model & Impact
Decipher.io operates on a **Bottom-Up SaaS model**, balancing immense social impact with scalable unit economics.
* **Free Tier:** All local, in-browser features (Visual overlays, Dyslexic fonts, Focus mode, standard formatting) are 100% free for individual users.
* **Pro/Campus Tier:** Advanced AI processing (Image OCR, Simplification, TTS, Speechbot) is monetized via an affordable micro-subscription for power users, or through B2B institutional site licenses sold directly to University Disability Support Offices.

---

## 🤝 Contributing
Decipher.io was built to make learning accessible for everyone. We welcome contributions! Please feel free to submit a Pull Request or open an Issue to discuss potential features, bug fixes, or new language support.
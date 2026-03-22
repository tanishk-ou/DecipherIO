import jsPDF from "jspdf";

// ==========================================
// 1. FONT CONFIGURATION
// ==========================================
const FONT_CONFIG: Record<string, { regular: string; bold: string; italic?: string; bolditalic?: string; pdfName: string }> = {
  Dyslexia: {
    regular: "/fonts/OpenDyslexic-Regular.ttf",
    bold: "/fonts/OpenDyslexic-Bold.ttf",
    italic: "/fonts/OpenDyslexic-Italic.ttf",
    bolditalic: "/fonts/OpenDyslexic-Bold-Italic.ttf",
    pdfName: "OpenDyslexic",
  },
  Atkinson: {
    regular: "/fonts/AtkinsonHyperlegible-Regular.ttf",
    bold: "/fonts/AtkinsonHyperlegible-Bold.ttf",
    pdfName: "AtkinsonHyperlegible",
  },
  Verdana: {
    regular: "/fonts/Verdana-Bold.ttf",
    bold: "/fonts/Verdana-Bold.ttf",
    pdfName: "VerdanaCustom",
  },
};

const BUILTIN_FONT_MAP: Record<string, string> = {
  Sans: "helvetica",
  Mono: "courier",
  Serif: "times",
};

const HEX_TO_RGB: Record<string, [number, number, number]> = {
    "#ef4444": [239, 68, 68],   // Red
    "#3b82f6": [59, 130, 246],  // Blue
    "#10b981": [16, 185, 129],  // Green
    "#eab308": [234, 179, 8],   // Yellow
};

// Async Font Fetcher
async function fetchFontAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 12) return null;
    
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  } catch (e) {
    console.warn(`Font fetch error: ${url}`, e);
    return null;
  }
}

interface PDFGenProps {
  title: string;
  sourceUrl?: string;
  summary: string;
  segments: { simplified: string }[];
  highlights: Record<number, { bold?: boolean; italic?: boolean; color?: string }>; // Add this
  settings: {
    fontLabel: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    bionicEnabled: boolean;
  };
}

// ==========================================
// 2. MAIN GENERATOR
// ==========================================
export const generateSmartPDF = async ({
  title,
  sourceUrl,
  summary,
  highlights,
  segments,
  settings
}: PDFGenProps) => {
  // Init PDF with 'pt' (Points) for precise text layout
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const usableWidth = pageWidth - (margin * 2);

  // --- A. LOAD & REGISTER FONTS ---
  let pdfFontName = "helvetica";
  let hasBold = true;

  if (BUILTIN_FONT_MAP[settings.fontLabel]) {
    pdfFontName = BUILTIN_FONT_MAP[settings.fontLabel];
    // Built-ins always have bold
  } else if (FONT_CONFIG[settings.fontLabel]) {
    const config = FONT_CONFIG[settings.fontLabel];
    const regB64 = await fetchFontAsBase64(config.regular);
    
    if (regB64) {
      // Register Regular
      doc.addFileToVFS(config.pdfName + "-Regular.ttf", regB64);
      doc.addFont(config.pdfName + "-Regular.ttf", config.pdfName, "normal");
      pdfFontName = config.pdfName;

      // Register Bold
      const boldB64 = await fetchFontAsBase64(config.bold);
      if (boldB64) {
        doc.addFileToVFS(config.pdfName + "-Bold.ttf", boldB64);
        doc.addFont(config.pdfName + "-Bold.ttf", config.pdfName, "bold");
      } else {
        hasBold = false; // Fallback if no bold file
      }

      // Register Italic
      if (config.italic) {
        const italicB64 = await fetchFontAsBase64(config.italic);
        if (italicB64) {
          doc.addFileToVFS(config.pdfName + "-Italic.ttf", italicB64);
          doc.addFont(config.pdfName + "-Italic.ttf", config.pdfName, "italic");
        }
      }

      // Register BoldItalic
      if (config.bolditalic) {
        const biB64 = await fetchFontAsBase64(config.bolditalic);
        if (biB64) {
          doc.addFileToVFS(config.pdfName + "-BoldItalic.ttf", biB64);
          doc.addFont(config.pdfName + "-BoldItalic.ttf", config.pdfName, "bolditalic");
        }
      }
    }
  }

  // Helper to safely switch styles using the CORRECT font
  // Replace your current setStyle with this:
  const setStyle = (style: "normal" | "bold" | "italic" | "bolditalic", size: number, color: [number, number, number]) => {
    let safeStyle = style;
    if (!hasBold && style.includes("bold")) safeStyle = style.replace("bold", "") as any || "normal";
    
    try { doc.setFont(pdfFontName, safeStyle); } 
    catch { doc.setFont("helvetica", safeStyle); } 
    
    doc.setFontSize(size);
    doc.setTextColor(...color);
    
    if (typeof (doc as any).setCharSpace === "function") {
      (doc as any).setCharSpace(settings.letterSpacing * 0.4);
    }
  };

  // --- B. CURSOR MANAGEMENT ---
  let cursorY = 0;
  const ensureSpace = (needed: number) => {
    if (cursorY + needed > pageHeight - margin) {
      doc.addPage();
      cursorY = margin + 20;
    }
  };

  // --- C. TEXT RENDERING ENGINE (Unified) ---
  // This handles Headings, Summary, and Content identically
  // --- C. TEXT RENDERING ENGINE (Unified) ---
  const writeContentBlock = (
    text: string, 
    fontStyle: "normal" | "bold" | "italic" | "bolditalic", // Accepts full styles now
    fontSize: number, 
    color: [number, number, number], // Accepts custom colors now
    useBionic: boolean
  ) => {
    const lineHeight = fontSize * settings.lineHeight;
    
    // Uses the passed values instead of hardcoding!
    setStyle(fontStyle, fontSize, color);

    if (useBionic) {
      // Use Bionic Renderer
      writeBionicBlock(
        doc, text, margin, usableWidth, fontSize, lineHeight,
        pdfFontName, (settings.letterSpacing * 0.4), hasBold,
        fontStyle,
        ensureSpace, () => cursorY, (val) => cursorY = val
      );
    } else {
      // Standard Renderer
      const lines = doc.splitTextToSize(text, usableWidth);
      for (const line of lines) {
        ensureSpace(lineHeight);
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      }
    }
  };

  // ============================
  // START DRAWING PDF
  // ============================

  // 1. BRAND HEADER (Fixed Style)
  doc.setFillColor(157, 226, 172); // Green
  doc.rect(0, 0, pageWidth, 50, "F");
  
  doc.setFont("helvetica", "normal"); // Keep brand font standard
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Decipher.IO | Accessibility Document", margin, 30);
  cursorY = 90;

  // 2. DOCUMENT TITLE (Uses Custom Font!)
  setStyle("bold", 24, [20, 20, 20]);
  const titleLines = doc.splitTextToSize(title, usableWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += (titleLines.length * 28) + 10;

  // 3. METADATA
  setStyle("normal", 10, [100, 100, 100]);
  doc.text(`Font: ${settings.fontLabel} | Bionic: ${settings.bionicEnabled ? "ON" : "OFF"}`, margin, cursorY);
  cursorY += 15;
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 30;

  // 4. EXECUTIVE SUMMARY (Now uses Custom Font + Bionic + No Box)
  if (summary) {
    // Heading
    setStyle("bold", 14, [0, 0, 0]);
    doc.text("Executive Summary", margin, cursorY);
    cursorY += 20;

    // Content (Uses unified writer)
    // We use a slightly smaller font for summary, but apply Bionic logic
    // Content (Uses unified writer)
    const summarySize = Math.max(settings.fontSize * 0.70, 10);
    writeContentBlock(summary, "normal", summarySize, [40, 40, 40], settings.bionicEnabled);
    
    cursorY += 30; // Gap after summary
    
    // Second Divider to separate Summary from Content
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 30;
  }

  // 5. REFINED CONTENT
  setStyle("bold", 14, [0, 0, 0]);
  doc.text("Refined Content", margin, cursorY);
  cursorY += 20;

  const contentSize = Math.max(settings.fontSize * 0.75, 11);
  
  // Replace your existing segments loop with this:
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const h = highlights[i] || {};
    
    ensureSpace(contentSize * settings.lineHeight);
    
    // Determine Font Style
    let fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal";
    if (h.bold && h.italic) fontStyle = "bolditalic";
    else if (h.bold) fontStyle = "bold";
    else if (h.italic) fontStyle = "italic";

    // Determine Color
    const rgbColor = h.color && HEX_TO_RGB[h.color] ? HEX_TO_RGB[h.color] : [40, 40, 40];

    // Pass everything to the writer!
    writeContentBlock(
      seg.simplified, 
      fontStyle, 
      contentSize, 
      rgbColor as [number, number, number], 
      settings.bionicEnabled
    );
    
    cursorY += (contentSize * 0.8); // Paragraph gap
  }

  // 6. FOOTER
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic"); // Footer stays simple
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, { align: "right" });
  }

  // SAVE
  const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`decipher_${cleanTitle}.pdf`);
};

// ==========================================
// 3. BIONIC LOGIC
// ==========================================
function writeBionicBlock(
  doc: jsPDF, text: string, x: number, width: number, size: number, 
  leading: number, fontName: string, charSpacing: number, hasBold: boolean,
  baseStyle: "normal" | "bold" | "italic" | "bolditalic", // <--- NEW PARAMETER
  checkSpace: (n: number) => void, getY: () => number, setY: (v: number) => void
) {
  const words = text.split(/\s+/).filter(Boolean);
  let line: string[] = [];

  // Determine what "bold" and "normal" mean in the current context
  const targetBoldStyle = baseStyle === "italic" || baseStyle === "bolditalic" ? "bolditalic" : "bold";
  const targetNormalStyle = baseStyle === "italic" || baseStyle === "bolditalic" ? "italic" : "normal";

  const flushLine = () => {
    if (line.length === 0) return;
    
    checkSpace(leading);
    const y = getY();
    let curX = x;

    line.forEach((word, i) => {
      // Calculate Bold Split
      const len = word.length;
      let boldLen = 0;
      if (len === 1) boldLen = 1;
      else if (len <= 3) boldLen = 1;
      else if (len <= 6) boldLen = Math.ceil(len * 0.5); 
      else boldLen = Math.ceil(len * 0.4);

      const boldPart = word.slice(0, boldLen);
      const normalPart = word.slice(boldLen);

      // 1. Draw Bold Part
      try { doc.setFont(fontName, hasBold ? targetBoldStyle : targetNormalStyle); } catch {}
      doc.setFontSize(size);
      doc.text(boldPart, curX, y);
      curX += doc.getTextWidth(boldPart);

      // 2. Draw Normal Part
      if (normalPart) {
        try { doc.setFont(fontName, targetNormalStyle); } catch {}
        doc.setFontSize(size);
        doc.text(normalPart, curX, y);
        curX += doc.getTextWidth(normalPart);
      }

      // 3. Draw Space
      if (i < line.length - 1) {
        curX += doc.getTextWidth(" ");
      }
    });

    setY(y + leading);
    line = [];
  };

  for (const word of words) {
    const testLine = [...line, word].join(" ");
    try { doc.setFont(fontName, targetNormalStyle); } catch {} 
    
    if (doc.getTextWidth(testLine) > width && line.length > 0) {
      flushLine();
    }
    line.push(word);
  }
  flushLine();
}
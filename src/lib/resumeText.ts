import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Reads the text of a resume so the website builder can use it. Same
// approach as the older resume step: PDF and Word files are read in the
// browser and only the text is passed on.
export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type.includes("pdf")) {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const line = content.items.map((it: any) => (it.str ? it.str : "")).join(" ").trim();
      if (line) text += `=== Page ${i} ===\n${line}\n\n`;
    }
    return text.trim() ? `Document: ${file.name}\nPages: ${pdf.numPages}\n\n${text.trim()}` : "";
  }
  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return (result.value || "").trim();
  }
  return "";
}

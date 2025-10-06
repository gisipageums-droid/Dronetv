import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import * as mammoth from "mammoth";

// Using pdfjs-dist for reliable PDF text extraction
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Point PDF.js to the locally-bundled worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// (Optional) debug logs
console.log('PDF.js version:', pdfjsLib.version);
console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);

// Set up PDF.js worker with multiple fallback options

// Types
interface ExtractedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  extractedText: string;
  uploadDate: Date;
}

interface DocumentTextExtractorProps {
  className?: string;
}

const DocumentTextExtractor: React.FC<DocumentTextExtractorProps> = ({ className = '' }) => {
  const [documents, setDocuments] = useState<ExtractedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ExtractedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const newDocuments: ExtractedDocument[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`Processing file: ${file.name} (${file.type})`);
        const extractedText = await extractTextFromFile(file);
        const document: ExtractedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type || 'unknown',
          size: file.size,
          extractedText,
          uploadDate: new Date(),
        };
        newDocuments.push(document);
        console.log(`Successfully processed: ${file.name}`);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Still create a document entry with error message
        const document: ExtractedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type || 'unknown',
          size: file.size,
          extractedText: `Error processing ${file.name}:

${error instanceof Error ? error.message : 'Unknown error occurred'}

Please try:
1. Re-uploading the file
2. Converting to a different format
3. Checking if the file is corrupted`,
          uploadDate: new Date(),
        };
        newDocuments.push(document);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Show errors in console but don't disrupt user experience
    if (errors.length > 0) {
      console.warn('File processing errors:', errors);
    }

    setDocuments(prev => [...prev, ...newDocuments]);
    if (newDocuments.length > 0 && !selectedDocument) {
      setSelectedDocument(newDocuments[0]);
    }
    setIsLoading(false);
  };

  // Extract text from different file types
  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type.toLowerCase();
    
    if (fileType.includes('pdf')) {
      return await extractTextFromPDF(file);
    } else if (fileType.includes('word') || fileType.includes('document') || file.name.endsWith('.docx')) {
      return await extractTextFromWord(file);
    } else if (fileType.includes('text') || file.name.endsWith('.txt')) {
      return await extractTextFromTxt(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  };

  // Extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log('Extracting PDF text from:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      
      // Try the main PDF.js approach first
      try {
const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
const pdf = await loadingTask.promise;
        
        console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          try {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Combine text items from the page
            const pageText = textContent.items
              .map((item: any) => {
                // Handle different text item types
                if (typeof item === 'object' && item.str) {
                  return item.str;
                }
                return String(item);
              })
              .filter(text => text && text.trim().length > 0)
              .join(' ');
            
            if (pageText.trim()) {
              fullText += `=== Page ${pageNum} ===\n${pageText.trim()}\n\n`;
            }
            
            console.log(`Page ${pageNum} processed: ${pageText.length} characters`);
          } catch (pageError) {
            console.warn(`Error processing page ${pageNum}:`, pageError);
            fullText += `=== Page ${pageNum} ===\n[Error reading page content]\n\n`;
          }
        }
        
        if (fullText.trim()) {
          return `Document: ${file.name}
Pages: ${pdf.numPages}
Extracted: ${new Date().toLocaleString()}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

${fullText.trim()}`;
        } else {
          throw new Error('No readable text content found using PDF.js');
        }
      } catch (pdfError) {
        console.warn('PDF.js extraction failed, trying fallback method:', pdfError);
        
        // Fallback: Simple text extraction from PDF structure
        const text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
        
        // Look for text patterns in the PDF structure
        const textPatterns = [
          /\(([^)]+)\)/g,  // Text in parentheses
          /\[([^\]]+)\]/g, // Text in brackets
          /Tj\s*([^\n]+)/g, // Text objects
          />\s*([^<]+)</g   // Text between angle brackets
        ];
        
        let extractedText = '';
        for (const pattern of textPatterns) {
          const matches = text.match(pattern);
          if (matches) {
            extractedText += matches
              .map(match => match.replace(/[\(\)\[\]<>]/g, ''))
              .filter(text => text.length > 2 && /[a-zA-Z]/.test(text))
              .join(' ') + ' ';
          }
        }
        
        if (extractedText.trim() && extractedText.length > 50) {
          return `Document: ${file.name} (Fallback Extraction)
Extracted: ${new Date().toLocaleString()}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

Note: This is a fallback extraction method. Some formatting may be lost.

${extractedText.trim()}`;
        } else {
          throw pdfError; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      
      // Provide detailed error information
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return `PDF Document: ${file.name}

Extraction Failed: ${errorMessage}

File Information:
- Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Type: ${file.type}
- Upload Time: ${new Date().toLocaleString()}

Troubleshooting Steps:

🔧 Technical Issues:
1. Worker Loading Failed: Try refreshing the page or check internet connection
2. CORS Issues: The PDF.js worker couldn't load from CDN
3. Browser Compatibility: Try using a different browser (Chrome, Firefox)

📄 PDF Issues:
4. Password Protection: Remove password protection from the PDF
5. Corrupted File: Try re-downloading the PDF
6. Scanned Document: This PDF might be image-based, use OCR software
7. Complex Format: Try converting to a simpler format first

💡 Alternative Solutions:
- Copy text directly from your PDF reader and paste into a .txt file
- Use online PDF to text converters
- Convert PDF to Word document first
- Try opening in different PDF readers
- Use dedicated PDF text extraction tools

🌐 Online Tools:
- SmallPDF, ILovePDF, PDF24 (online converters)
- Adobe Acrobat Reader (copy text feature)
- Google Docs (upload PDF and export as text)`;
    }
  };

  // Extract text from Word documents
  const extractTextFromWord = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      return result.value || 'No text content found in the document.';
    } catch (error) {
      throw new Error('Failed to extract text from Word document');
    }
  };

  // Extract text from text files
  const extractTextFromTxt = async (file: File): Promise<string> => {
    try {
      return await file.text();
    } catch (error) {
      throw new Error('Failed to read text file');
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Download extracted text
  const downloadText = (doc: ExtractedDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.name}_extracted.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Delete document
  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocument?.id === id) {
      const remaining = documents.filter(doc => doc.id !== id);
      setSelectedDocument(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type icon
  const getFileTypeIcon = (type: string, name: string) => {
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return '📄';
    } else if (type.includes('word') || type.includes('document') || name.endsWith('.docx') || name.endsWith('.doc')) {
      return '📝';
    } else if (type.includes('text') || name.endsWith('.txt')) {
      return '📋';
    }
    return '📎';
  };

  return (
    <div className={`min-h-screen bg-yellow-50 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-yellow-400 rounded-lg shadow-lg p-6 mb-6 border-2 border-red-500">
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-red-600" />
            Document Text Extractor
          </h1>
          <p className="text-gray-800">
            Upload PDF, Word, or text documents to extract and view their content in a clean format.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 overflow-hidden">
              <div className="bg-red-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Documents
                </h2>
              </div>
              
              {/* File Upload Area */}
              <div
                className={`p-6 border-2 border-dashed m-4 rounded-lg transition-all duration-200 ${
                  dragActive
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-red-400 hover:bg-yellow-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Drag & drop files here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? 'Processing...' : 'Choose Files'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-4 text-center">
                  Supported formats: PDF, DOC, DOCX, TXT
                </div>
              </div>

              {/* Document List */}
              {documents.length > 0 && (
                <div className="border-t border-gray-200">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Uploaded Documents</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedDocument?.id === doc.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300 hover:bg-yellow-50'
                          }`}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-lg">{getFileTypeIcon(doc.type, doc.name)}</span>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm text-gray-800 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadText(doc);
                                }}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Download extracted text"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDocument(doc.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Display Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 overflow-hidden h-full">
              <div className="bg-black text-white p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Extracted Text
                  {selectedDocument && (
                    <span className="text-sm font-normal text-gray-300">
                      - {selectedDocument.name}
                    </span>
                  )}
                </h2>
                {selectedDocument && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFullText(!showFullText)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-black rounded text-sm font-medium hover:bg-yellow-400 transition-colors"
                    >
                      {showFullText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showFullText ? 'Collapse' : 'Expand'}
                    </button>
                    <button
                      onClick={() => downloadText(selectedDocument)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {selectedDocument ? (
                  <div className="space-y-4">
                    {/* Document Info */}
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">File:</span>
                          <p className="text-gray-600 truncate">{selectedDocument.name}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Size:</span>
                          <p className="text-gray-600">{formatFileSize(selectedDocument.size)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Type:</span>
                          <p className="text-gray-600">{selectedDocument.type || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Uploaded:</span>
                          <p className="text-gray-600">{selectedDocument.uploadDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Extracted Text */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Extracted Content</h3>
                        <p className="text-sm text-gray-600">
                          {selectedDocument.extractedText.length} characters
                        </p>
                      </div>
                      <div 
                        className={`p-4 bg-white ${
                          showFullText ? 'max-h-none' : 'max-h-96 overflow-y-auto'
                        }`}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {selectedDocument.extractedText ? (
                          <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {selectedDocument.extractedText}
                          </pre>
                        ) : (
                          <p className="text-gray-500 italic">No text content found in this document.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Document Selected</h3>
                    <p className="text-gray-500">
                      Upload a document to view its extracted text content here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTextExtractor;
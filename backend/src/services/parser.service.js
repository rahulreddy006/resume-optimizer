import { PDFParse } from "pdf-parse"; // Native ESM named import
import mammoth from "mammoth";

export const parsePDF = async (buffer) => {
  // Use the new v2 Class-based API
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  
  return result.text; 
};

export const parseDOCX = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

export const parseResume = async (buffer, mimetype) => {
  if (mimetype === "application/pdf") {
    return await parsePDF(buffer);
  } 
  if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return await parseDOCX(buffer);
  }
  throw new Error("Unsupported file type");
};
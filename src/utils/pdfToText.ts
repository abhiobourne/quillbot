import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (pdfBuffer: Buffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF.');
  }
};

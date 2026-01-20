import { PDFParse } from 'pdf-parse';
const parser = new PDFParse(Buffer.from('%PDF-1.4...'));
console.log('Instance properties:', Object.keys(parser));
console.log('Instance prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));

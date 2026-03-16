import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir);

for (const file of files) {
  if (file.endsWith('.png') || file.endsWith('.ico')) {
    const filePath = path.join(publicDir, file);
    const data = fs.readFileSync(filePath);
    fs.writeFileSync(`${filePath}.b64`, data.toString('base64'));
    console.log(`Encoded ${file} to ${file}.b64`);
  }
}

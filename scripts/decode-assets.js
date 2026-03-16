import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir);

for (const file of files) {
  if (file.endsWith('.b64')) {
    const filePath = path.join(publicDir, file);
    const data = fs.readFileSync(filePath, 'utf8');
    const originalFile = filePath.replace('.b64', '');
    fs.writeFileSync(originalFile, Buffer.from(data, 'base64'));
    console.log(`Decoded ${file} to ${path.basename(originalFile)}`);
  }
}

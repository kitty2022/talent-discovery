import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'talent-discovery-doc.html');
const pdfPath = path.join(__dirname, '天赋星鉴-产品功能说明书.pdf');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// 加载 HTML 文件
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

// 等待字体加载
await page.evaluate(() => document.fonts.ready);

// 生成 PDF
await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
  printBackground: true,
  displayHeaderFooter: false,
});

await browser.close();
console.log('✅ PDF 生成完成:', pdfPath);

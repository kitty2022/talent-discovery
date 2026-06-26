import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '镜相 · 发现你的天赋优势',
  description: '融合东方命理与西方心理学的综合天赋测评平台，帮你找到真正的天赋优势',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Noto Sans SC', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '天赋星鉴 · 发现你的天赋优势',
  description: '融合东方命理与西方心理学的综合天赋测评平台，帮你找到真正的天赋优势',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

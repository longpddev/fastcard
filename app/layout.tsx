import '@/styles/dist.css';
import React from 'react';
import Header from '@/ui/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Language card</title>
      </head>
      <body className="body">
        <Header />
        <main className="c-container relative pb-10">{children}</main>
      </body>
    </html>
  );
}

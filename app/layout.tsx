import '@/styles/dist.css';
import React from 'react';
import Header from '@/ui/Header';
import Footer from '@/ui/Footer';
import Providers from './providers';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Language card</title>
      </head>
      <body className="body">
        <Providers>
          <Header />
          <main className="c-container relative pb-10">{children}</main>
          <Footer></Footer>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;

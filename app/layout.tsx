import '@/styles/dist.css';
import React from 'react';
import Providers from './providers';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        />
        <title>Language card</title>
      </head>
      <body className="body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

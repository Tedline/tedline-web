export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-NW9WGL9YW8'); // Replace with your Google Analytics ID
  
      // Add the Google Analytics script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NW9WGL9YW8'; // Replace with your Google Analytics ID
      document.head.appendChild(script);
    }
  });
  
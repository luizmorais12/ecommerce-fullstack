// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

// Configuração para acessibilidade do react-modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Toasts globais */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Modal e páginas */}
      <Component {...pageProps} />
    </>
  );
}

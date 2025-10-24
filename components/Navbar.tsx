import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'carrinho';

export default function Navbar() {
  const [totalItens, setTotalItens] = useState(0);

  useEffect(() => {
    // Atualiza contador ao carregar a página
    const dadosLocal = localStorage.getItem(STORAGE_KEY);
    if (dadosLocal) {
      const itens = JSON.parse(dadosLocal);
      const total = itens.reduce((sum: number, i: any) => sum + i.quantidade, 0);
      setTotalItens(total);
    }

    // Listener para atualizar quando o localStorage mudar
    window.addEventListener('storage', atualizarCarrinho);

    return () => {
      window.removeEventListener('storage', atualizarCarrinho);
    };
  }, []);

  function atualizarCarrinho() {
    const dadosLocal = localStorage.getItem(STORAGE_KEY);
    if (dadosLocal) {
      const itens = JSON.parse(dadosLocal);
      const total = itens.reduce((sum: number, i: any) => sum + i.quantidade, 0);
      setTotalItens(total);
    } else {
      setTotalItens(0);
    }
  }

  return (
    <nav className={styles.navbar}>
      <span>Loja Virtual</span>
      <div>
        <Link href="/">Produtos</Link>
        <Link href="/carrinho">
          Carrinho {totalItens > 0 && `(${totalItens})`}
        </Link>
      </div>
    </nav>
  );
}

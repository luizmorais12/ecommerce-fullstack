import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <span>Loja Virtual</span>
      <div>
        <Link href="/">Produtos</Link>
        <Link href="/carrinho">Carrinho</Link>
      </div>
    </nav>
  );
}

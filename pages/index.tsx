import { useEffect, useState } from 'react';
import { buscarProdutos, adicionarAoCarrinho } from '../lib/api';
import ProdutoCard from '../components/ProdutoCard';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarProdutos()
      .then(setProdutos)
      .catch(() => setErro('Erro ao carregar produtos'));
  }, []);

  async function handleAdd(id: number) {
    await adicionarAoCarrinho(id, 1);
    alert('Produto adicionado ao carrinho!');
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Produtos</h1>
        {erro && <p>{erro}</p>}
        <div className={styles.grid}>
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </>
  );
}

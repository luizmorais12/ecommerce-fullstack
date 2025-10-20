import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { buscarProdutos, adicionarAoCarrinho } from '../lib/api';

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarProdutos().then(setProdutos).catch(() => setErro('Erro ao carregar produtos'));
  }, []);

  async function handleAdd(id: number) {
    await adicionarAoCarrinho(id, 1);
    alert('Produto adicionado ao carrinho!');
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Loja Virtual</h1>
        {erro && <p>{erro}</p>}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { listarProdutos, adicionarAoCarrinho } from '../lib/api';
import { useRouter } from 'next/router';

// Tipo do produto
interface ProdutoType {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
}

export default function Produtos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos();
      setProdutos(dados.map((p: any) => ({
        ...p,
        preco: Number(p.preco),
      })));
    } catch {
      setErro('Erro ao carregar produtos.');
    }
  }

  async function handleAdicionar(produtoId: number) {
    try {
      await adicionarAoCarrinho(produtoId, 1);
      alert('Produto adicionado ao carrinho!');
    } catch {
      alert('Erro ao adicionar produto.');
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Produtos</h1>
        {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '20px' }}>
          {produtos.map(produto => (
            <div
              key={produto.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h3 style={{ margin: '10px 0' }}>{produto.nome}</h3>
              <p style={{ fontWeight: 'bold' }}>R$ {produto.preco.toFixed(2)}</p>
              <p>Estoque: {produto.estoque}</p>
              <button
                onClick={() => handleAdicionar(produto.id)}
                style={{
                  marginTop: '10px',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

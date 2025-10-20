// frontend/pages/carrinho.tsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CarrinhoItem from '../components/CarrinhoItem';
import { listarCarrinho, atualizarCarrinho, finalizarCompra } from '../lib/api';

interface Produto {
  id: number;
  nome: string;
  preco: number | string; // pode vir como string do backend
}

interface CarrinhoItemType {
  produto: Produto;
  quantidade: number;
}

export default function Carrinho() {
  const [itens, setItens] = useState<CarrinhoItemType[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarCarrinho();
  }, []);

  // Carrega o carrinho e converte preco para number
  async function carregarCarrinho() {
    try {
      const dados: CarrinhoItemType[] = await listarCarrinho();

      const carrinhoConvertido: CarrinhoItemType[] = dados.map((item: CarrinhoItemType) => ({
        ...item,
        produto: {
          ...item.produto,
          preco: Number(item.produto.preco),
        },
      }));

      setItens(carrinhoConvertido);
    } catch {
      setErro('Erro ao carregar carrinho');
    }
  }

  // Atualiza a quantidade de um item
  async function handleUpdate(id: number, quantidade: number) {
    try {
      await atualizarCarrinho(id, quantidade);
      await carregarCarrinho();
    } catch {
      alert('Não foi possível atualizar o item');
    }
  }

  // Finaliza a compra
  async function handleFinalizar() {
    try {
      await finalizarCompra();
      alert('Compra finalizada com sucesso!');
      setItens([]);
    } catch {
      alert('Erro ao finalizar compra');
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Carrinho</h1>
        {erro && <p>{erro}</p>}
        {itens.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            {itens.map((item) => (
              <CarrinhoItem
                key={item.produto.id}
                item={item}
                onUpdate={handleUpdate}
              />
            ))}
            <button
              onClick={handleFinalizar}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Finalizar Compra
            </button>
          </>
        )}
      </div>
    </>
  );
}

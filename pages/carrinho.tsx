// frontend/pages/carrinho.tsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CarrinhoItem from '../components/CarrinhoItem';
import { listarCarrinho, atualizarCarrinho, finalizarCompra } from '../lib/api';

// Tipagem dos produtos e itens do carrinho
interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface CarrinhoItemType {
  produto: Produto;
  quantidade: number;
}

export default function Carrinho() {
  const [itens, setItens] = useState<CarrinhoItemType[]>([]);
  const [erro, setErro] = useState<string>('');

  // Carrega o carrinho ao abrir a página
  useEffect(() => {
    carregarCarrinho();
  }, []);

  async function carregarCarrinho() {
  try {
    const dados: any[] = await listarCarrinho(); // tipagem temporária do fetch

    const carrinhoConvertido: CarrinhoItemType[] = dados.map((item: any) => ({
      produto: {
        id: Number(item.produto.id),
        nome: String(item.produto.nome),
        preco: Number(item.produto.preco),
      },
      quantidade: Number(item.quantidade),
    }));

    setItens(carrinhoConvertido);
  } catch {
    setErro('Erro ao carregar carrinho');
  }
}

  // Atualiza a quantidade de um item
  async function handleUpdate(produtoId: number, quantidade: number) {
    try {
      await atualizarCarrinho(produtoId, quantidade);
      await carregarCarrinho();
    } catch {
      alert('Não foi possível atualizar o item. Adicione o produto antes de alterar a quantidade.');
    }
  }

  // Finaliza a compra
  async function handleFinalizar() {
    try {
      await finalizarCompra();
      alert('Compra finalizada com sucesso!');
      setItens([]);
    } catch {
      alert('Erro ao finalizar compra. Tente novamente.');
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

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { listarVendasPorUsuario } from '../lib/api';
import Modal from 'react-modal';

interface ItemVenda {
  produto: { nome: string; preco: number };
  quantidade: number;
  subtotal: number;
}

interface Venda {
  id: number;
  total: number;
  status: string;
  itens: ItemVenda[];
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Venda[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Venda | null>(null);

  const usuarioId = 1;

  useEffect(() => {
    async function carregarPedidos() {
      const dados = await listarVendasPorUsuario(usuarioId);
      setPedidos(dados);
    }
    carregarPedidos();
  }, []);

  function abrirModal(pedido: Venda) {
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setPedidoSelecionado(null);
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
        <h1>Meus Pedidos</h1>
        {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}
        {pedidos.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Pedido #{p.id}</h3>
            <p>Status: <strong>{p.status}</strong></p>
            <p>Total: R$ {p.total.toFixed(2)}</p>
            <button
              onClick={() => abrirModal(p)}
              style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', marginTop: '10px' }}
            >
              Ver Detalhes
            </button>
          </div>
        ))}

        {pedidoSelecionado && (
          <Modal
            isOpen={modalAberto}
            onRequestClose={fecharModal}
            contentLabel="Detalhes do Pedido"
            style={{ content: { maxWidth: '500px', margin: 'auto', padding: '20px', borderRadius: '10px' } }}
          >
            <h2>Pedido #{pedidoSelecionado.id}</h2>
            <p>Status: <strong>{pedidoSelecionado.status}</strong></p>
            <ul>
              {pedidoSelecionado.itens.map((i, idx) => (
                <li key={idx}>{i.produto.nome} x {i.quantidade} = R$ {i.subtotal.toFixed(2)}</li>
              ))}
            </ul>
            <p>Total: R$ {pedidoSelecionado.total.toFixed(2)}</p>
            <button onClick={fecharModal} style={{ marginTop: '15px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' }}>
              Fechar
            </button>
          </Modal>
        )}
      </div>
    </>
  );
}

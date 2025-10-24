import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import CarrinhoItem from '../components/CarrinhoItem';
import { listarCarrinho, atualizarCarrinho, finalizarCompra } from '../lib/api';
import 'react-toastify/dist/ReactToastify.css';

// Tipo do item do carrinho
interface CarrinhoItemType {
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagem: string;
    estoque: number;
  };
  quantidade: number;
}

// Tipo do cupom
interface Cupom {
  codigo: string;
  desconto: number; // em reais
}

const STORAGE_KEY = 'carrinho';

export default function Carrinho() {
  const router = useRouter();
  const [itens, setItens] = useState<CarrinhoItemType[]>([]);
  const [erro, setErro] = useState('');
  const [cupom, setCupom] = useState('');
  const [cupomAtivo, setCupomAtivo] = useState<Cupom | null>(null);
  const [cuponsDisponiveis] = useState<Cupom[]>([
    { codigo: 'DESCONTO10', desconto: 10 },
    { codigo: 'DESCONTO20', desconto: 20 },
  ]);

  // Carrega o carrinho ao montar o componente
  useEffect(() => {
    carregarCarrinho();
  }, []);

  async function carregarCarrinho() {
    try {
      const dados = await listarCarrinho();
      const carrinhoConvertido = dados.map((item: any) => ({
        ...item,
        produto: { ...item.produto, preco: Number(item.produto.preco) },
      }));
      setItens(carrinhoConvertido);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinhoConvertido));
    } catch {
      const dadosLocal = localStorage.getItem(STORAGE_KEY);
      if (dadosLocal) {
        setItens(JSON.parse(dadosLocal));
      } else {
        setErro('Erro ao carregar carrinho');
      }
    }
  }

  // Atualiza a quantidade de um item
  async function handleUpdate(id: number, quantidade: number) {
    try {
      await atualizarCarrinho(id, quantidade);
      const novosItens = itens
        .map(i => (i.produto.id === id ? { ...i, quantidade } : i))
        .filter(i => i.quantidade > 0);
      setItens(novosItens);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosItens));
    } catch {
      toast.error('Não foi possível atualizar o item');
    }
  }

  // Finaliza a compra
  async function handleFinalizar() {
    try {
      await finalizarCompra();
      toast.success('Compra finalizada com sucesso!');

      // === 🔹 SALVAR HISTÓRICO LOCAL ===
      const historicoLocal = JSON.parse(localStorage.getItem('historicoCompras') || '[]');

      const novaCompra = {
        id: historicoLocal.length + 1,
        data: new Date().toISOString(),
        total: totalFinal,
        status: 'Concluída',
        itens: itens.map(i => ({
          nome: i.produto.nome,
          quantidade: i.quantidade,
          preco: i.produto.preco,
        })),
      };

      historicoLocal.push(novaCompra);
      localStorage.setItem('historicoCompras', JSON.stringify(historicoLocal));
      // === 🔹 FIM DO SALVAMENTO ===

      // Limpa carrinho
      setItens([]);
      setCupomAtivo(null);
      localStorage.removeItem(STORAGE_KEY);

      // Redireciona para a home após compra
      router.push('/');
    } catch {
      toast.error('Erro ao finalizar compra');
    }
  }

  // Aplica cupom
  function aplicarCupom() {
    const c = cuponsDisponiveis.find(c => c.codigo === cupom.toUpperCase());
    if (c) {
      setCupomAtivo(c);
      toast.success(`Cupom ${c.codigo} aplicado!`);
    } else {
      setCupomAtivo(null);
      toast.error('Cupom inválido');
    }
    setCupom('');
  }

  // Cálculos do resumo
  const subtotal = itens.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  );
  const frete = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const desconto = cupomAtivo ? cupomAtivo.desconto : 0;
  const totalFinal = subtotal + frete - desconto;

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: '900px',
          margin: '40px auto',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Carrinho</h1>
        {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

        {itens.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>
            Seu carrinho está vazio.
          </p>
        ) : (
          <>
            {/* Lista de itens */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {itens.map(item => (
                <CarrinhoItem
                  key={item.produto.id}
                  item={item}
                  onUpdate={handleUpdate}
                  disabledMais={item.produto.estoque <= item.quantidade} 
                />
              ))}
            </div>

            {/* Cupons */}
            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                border: '1px dashed #ccc',
                borderRadius: '8px',
              }}
            >
              <h3>Cupons Disponíveis</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {cuponsDisponiveis.map(c => (
                  <button
                    key={c.codigo}
                    onClick={() => setCupom(c.codigo)}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #0070f3',
                      borderRadius: '5px',
                      backgroundColor: '#f0f8ff',
                      cursor: 'pointer',
                    }}
                  >
                    {c.codigo} (-R$ {c.desconto})
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '10px' }}>
                <input
                  value={cupom}
                  onChange={e => setCupom(e.target.value)}
                  placeholder="Digite um cupom"
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
                <button
                  onClick={aplicarCupom}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 15px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Resumo da compra */}
            <div
              style={{
                marginTop: '30px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#e0f7fa',
              }}
            >
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Resumo da Compra</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '16px' }}>
                <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
                <p>Frete: R$ {frete.toFixed(2)}</p>
                {desconto > 0 && (
                  <p style={{ color: 'green' }}>
                    Desconto ({cupomAtivo?.codigo}): -R$ {desconto.toFixed(2)}
                  </p>
                )}
                <h3>Total Final: R$ {totalFinal.toFixed(2)}</h3>
                {subtotal >= 100 && (
                  <p style={{ color: 'green', fontStyle: 'italic' }}>
                    Frete grátis aplicado automaticamente!
                  </p>
                )}
              </div>
            </div>

            {/* Botão finalizar */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleFinalizar}
                style={{
                  padding: '10px 25px',
                  fontSize: '16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

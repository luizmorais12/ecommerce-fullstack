import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProdutoCard from '../components/ProdutoCard';
import { listarProdutos, adicionarAoCarrinho } from '../lib/api';
import styles from '../styles/Home.module.css';

const STORAGE_KEY = 'carrinho';

// Tipo do produto
interface ProdutoType {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
}

// Tipo do item do carrinho
interface CarrinhoItemType {
  produto: ProdutoType;
  quantidade: number;
}

// Tipo do cupom
interface Cupom {
  codigo: string;
  desconto: number; // valor em reais
}

export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [erro, setErro] = useState('');
  const [carrinho, setCarrinho] = useState<CarrinhoItemType[]>([]);
  const [cupom, setCupom] = useState('');
  const [cupomAtivo, setCupomAtivo] = useState<Cupom | null>(null);
  const cuponsDisponiveis: Cupom[] = [
    { codigo: 'DESCONTO10', desconto: 10 },
    { codigo: 'DESCONTO20', desconto: 20 },
  ];

  // Carrega produtos e carrinho do localStorage
  useEffect(() => {
    carregarProdutos();
    const dadosLocal = localStorage.getItem(STORAGE_KEY);
    if (dadosLocal) setCarrinho(JSON.parse(dadosLocal));
  }, []);

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos();
      setProdutos(dados.map((p: any) => ({ ...p, preco: Number(p.preco) })));
    } catch {
      setErro('Erro ao carregar produtos.');
    }
  }

  // Adiciona produto ao carrinho
  async function handleAdd(produto: ProdutoType) {
    try {
      const index = carrinho.findIndex(i => i.produto.id === produto.id);
      let novosItens: CarrinhoItemType[];

      if (index >= 0) {
        novosItens = [...carrinho];
        novosItens[index].quantidade += 1;
      } else {
        novosItens = [...carrinho, { produto, quantidade: 1 }];
      }

      setCarrinho(novosItens);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosItens));

      // Atualiza no back-end
      await adicionarAoCarrinho(produto.id, 1);

      alert('Produto adicionado ao carrinho!');
    } catch {
      alert('Erro ao adicionar produto.');
    }
  }

  // Aplica cupom
  function aplicarCupom() {
    const c = cuponsDisponiveis.find(c => c.codigo === cupom.toUpperCase());
    if (c) {
      setCupomAtivo(c);
      alert(`Cupom ${c.codigo} aplicado!`);
    } else {
      alert('Cupom inválido');
      setCupomAtivo(null);
    }
    setCupom('');
  }

  // Calcula valores do resumo
  const subtotal = carrinho.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  const frete = subtotal >= 100 || subtotal === 0 ? 0 : 15;
  const desconto = cupomAtivo ? cupomAtivo.desconto : 0;
  const totalFinal = subtotal + frete - desconto;

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.titulo}>🛒 Loja Virtual</h1>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {/* Grid de produtos */}
        <div className={styles.grid}>
          {produtos.map(p => (
            <ProdutoCard key={p.id} produto={p} onAdd={() => handleAdd(p)} />
          ))}
        </div>

        {/* Cupons */}
        <div style={{ marginTop: '30px' }}>
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
              style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc' }}
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

        {/* Resumo */}
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
          <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
          <p>Frete: R$ {frete.toFixed(2)}</p>
          {desconto > 0 && <p style={{ color: 'green' }}>Desconto ({cupomAtivo?.codigo}): -R$ {desconto.toFixed(2)}</p>}
          <h3>Total Final: R$ {totalFinal.toFixed(2)}</h3>
        </div>
      </main>
    </>
  );
}

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { listarVendasPorUsuario } from '../lib/api';
import styles from '../styles/Home.module.css';

// Tipo de compra
interface Compra {
  id: number;
  data: string;
  total: number;
  status: string;
  itens: {
    nome: string;
    quantidade: number;
    preco: number;
  }[];
}

export default function Historico() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      const usuarioId = 1;
      const dados = await listarVendasPorUsuario(usuarioId);

      if (dados && dados.length > 0) {
        setCompras(dados);
        localStorage.setItem('historicoCompras', JSON.stringify(dados));
      } else {
        // fallback para localStorage
        const local = localStorage.getItem('historicoCompras');
        if (local) setCompras(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem('historicoCompras');
      if (local) setCompras(JSON.parse(local));
      else setErro('Não foi possível carregar o histórico de compras.');
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.titulo}>📜 Histórico de Compras</h1>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {compras.length === 0 && !erro && (
          <p style={{ textAlign: 'center', marginTop: '30px' }}>
            Nenhuma compra encontrada.
          </p>
        )}

        <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
          {compras.map((compra) => (
            <div
              key={compra.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <h3>Compra #{compra.id}</h3>
              <p>🗓️ Data: {new Date(compra.data).toLocaleDateString('pt-BR')}</p>
              <p>💰 Total: R$ {compra.total.toFixed(2)}</p>
              <p>📦 Status: {compra.status}</p>

              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', color: '#0070f3' }}>
                  Ver itens
                </summary>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {compra.itens.map((item, i) => (
                    <li key={i}>
                      {item.nome} — {item.quantidade}x R$ {item.preco.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

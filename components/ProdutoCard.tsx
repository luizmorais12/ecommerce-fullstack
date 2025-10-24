
import React from 'react';
import styles from '../styles/Home.module.css'; 

interface ProdutoCardProps {
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagem: string;
    estoque: number;
  };
  onAdd: (produtoId: number) => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onAdd }) => {
  const preco = Number(produto.preco);
  const estaDisponivel = produto.estoque > 0;

  return (
    <div className={styles.card}>
      <img src={produto.imagem} alt={produto.nome} />
      <h2>{produto.nome}</h2>
      <p>R$ {preco.toFixed(2)}</p>

      {/* Estoque */}
      <p
        style={{
          marginBottom: '10px',
          color: estaDisponivel ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {estaDisponivel ? `Em estoque: ${produto.estoque}` : 'Esgotado'}
      </p>

      <button
        onClick={() => onAdd(produto.id)}
        disabled={!estaDisponivel}
        style={{
          padding: '8px 15px',
          backgroundColor: estaDisponivel ? '#0070f3' : '#999',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: estaDisponivel ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
        }}
      >
        Adicionar
      </button>
    </div>
  );
};

export default ProdutoCard;

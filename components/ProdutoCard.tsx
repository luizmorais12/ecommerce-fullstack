// components/ProdutoCard.tsx
import React from 'react';
import styles from '../styles/ProdutoCard.module.css';

interface ProdutoCardProps {
  produto: {
    id: number;
    nome: string;
    preco: number | string; // aceita número ou string
    imagem: string;
  };
  onAdd: (produtoId: number) => void;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onAdd }) => {
  const preco = Number(produto.preco) || 0; // garante número seguro

  return (
    <div className={styles.card}>
      <img src={produto.imagem} alt={produto.nome} />
      <h2>{produto.nome}</h2>
      <p>R$ {preco.toFixed(2)}</p>
      <button onClick={() => onAdd(produto.id)}>Adicionar</button>
    </div>
  );
};

export default ProdutoCard;

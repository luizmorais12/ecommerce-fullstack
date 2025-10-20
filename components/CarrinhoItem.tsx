// frontend/components/CarrinhoItem.tsx
import React from 'react';
import styles from '../styles/CarrinhoItem.module.css'; 
export interface CarrinhoItemProps {
  item: {
    produto: {
      id: number;
      nome: string;
      preco: number | string; // aceita string vindo do backend
    };
    quantidade: number;
  };
  onUpdate: (produtoId: number, quantidade: number) => void;
}

const CarrinhoItem: React.FC<CarrinhoItemProps> = ({ item, onUpdate }) => {
  const preco = Number(item.produto.preco); // converte para número
  const subtotal = preco * item.quantidade;

  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemInfo}>
        <p>{item.produto.nome}</p>
        <p>R$ {preco.toFixed(2)}</p>
      </div>
      <div className={styles.itemButtons}>
        <button onClick={() => onUpdate(item.produto.id, item.quantidade - 1)} disabled={item.quantidade <= 1}>-</button>
        <span>{item.quantidade}</span>
        <button onClick={() => onUpdate(item.produto.id, item.quantidade + 1)}>+</button>
        <button onClick={() => onUpdate(item.produto.id, 0)}>Remover</button>
      </div>
      <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
    </div>
  );
};

export default CarrinhoItem;

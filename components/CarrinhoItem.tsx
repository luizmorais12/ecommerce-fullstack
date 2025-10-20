import React from 'react';

export interface CarrinhoItemProps {
  item: {
    produto: { id: number; nome: string; preco: number };
    quantidade: number;
  };
  onUpdate: (produtoId: number, quantidade: number) => void;
}

const CarrinhoItem: React.FC<CarrinhoItemProps> = ({ item, onUpdate }) => {
  const subtotal = item.produto.preco * item.quantidade;

  return (
    <div className="carrinho-item">
      <div>
        <p>{item.produto.nome}</p>
        <p>R$ {subtotal.toFixed(2)}</p>
      </div>
      <div className="carrinho-buttons">
        <button onClick={() => onUpdate(item.produto.id, item.quantidade - 1)} disabled={item.quantidade <= 1}>-</button>
        <span>{item.quantidade}</span>
        <button onClick={() => onUpdate(item.produto.id, item.quantidade + 1)}>+</button>
        <button onClick={() => onUpdate(item.produto.id, 0)}>Remover</button>
      </div>
    </div>
  );
};

export default CarrinhoItem;

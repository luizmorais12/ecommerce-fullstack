import React from 'react';

export interface CarrinhoItemProps {
  item: {
    produto: {
      id: number;
      nome: string;
      preco: number;
      imagem: string;
      estoque: number; // necessário para desabilitar o +
    };
    quantidade: number;
  };
  onUpdate: (produtoId: number, quantidade: number) => void;
  disabledMais?: boolean;  // desabilita o +
  disabledMenos?: boolean; // desabilita o -
}

const CarrinhoItem: React.FC<CarrinhoItemProps> = ({ item, onUpdate, disabledMais, disabledMenos }) => {
  const { produto, quantidade } = item;
  const preco = Number(produto.preco);
  const subtotal = preco * quantidade;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderBottom: '1px solid #ccc',
        padding: '10px 0',
      }}
    >
      <img
        src={produto.imagem}
        alt={produto.nome}
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{produto.nome}</p>
        <p style={{ color: '#555' }}>R$ {preco.toFixed(2)}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <button
          onClick={() => onUpdate(produto.id, quantidade - 1)}
          disabled={disabledMenos || quantidade <= 1}
          style={{ width: '30px', height: '30px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          -
        </button>
        <span>{quantidade}</span>
        <button
          onClick={() => onUpdate(produto.id, quantidade + 1)}
          disabled={disabledMais}
          style={{ width: '30px', height: '30px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          +
        </button>
        <button
          onClick={() => onUpdate(produto.id, 0)}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Remover
        </button>
      </div>

      <p style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>R$ {subtotal.toFixed(2)}</p>
    </div>
  );
};

export default CarrinhoItem;

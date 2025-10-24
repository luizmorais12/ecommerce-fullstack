import React from 'react';

interface ItemResumo {
  produto: string;
  quantidade: number;
  subtotal: number;
}

interface ResumoCompraProps {
  pedidoId?: number;
  data?: string;
  itens: ItemResumo[];
  total: number;
  onFechar: () => void;
}

const ResumoCompra: React.FC<ResumoCompraProps> = ({ pedidoId, data, itens, total, onFechar }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>Compra Finalizada!</h2>
        {pedidoId && <p><strong>Pedido #:</strong> {pedidoId}</p>}
        {data && <p><strong>Data:</strong> {data}</p>}

        <div style={{ margin: '20px 0' }}>
          {itens.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span>{item.produto} x {item.quantidade}</span>
              <span>R$ {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <h3 style={{ textAlign: 'right', marginBottom: '20px' }}>Total: R$ {total.toFixed(2)}</h3>

        <button
          onClick={onFechar}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ResumoCompra;

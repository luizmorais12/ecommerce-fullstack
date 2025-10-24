const API_URL = 'http://localhost:3001'; 

// Produtos
export async function listarProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

// Carrinho
export async function adicionarAoCarrinho(produtoId: number, quantidade: number) {
  const res = await fetch(`${API_URL}/carrinho`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produtoId, quantidade }),
  });
  if (!res.ok) throw new Error('Erro ao adicionar ao carrinho');
  return res.json();
}

export async function listarCarrinho() {
  const res = await fetch(`${API_URL}/carrinho`);
  if (!res.ok) throw new Error('Erro ao listar carrinho');
  return res.json();
}

export async function atualizarCarrinho(produtoId: number, quantidade: number) {
  const res = await fetch(`${API_URL}/carrinho`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produtoId, quantidade }),
  });
  if (!res.ok) throw new Error('Erro ao atualizar carrinho');
  return res.json();
}

export async function finalizarCompra() {
  const res = await fetch(`${API_URL}/carrinho/finalizar-compra`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao finalizar compra');
  return res.json();
}

// Histórico de vendas
export async function listarVendasPorUsuario(usuarioId: number) {
  const res = await fetch(`${API_URL}/vendas/usuario/${usuarioId}`);
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  const dados = await res.json();

  // Ajusta o formato para o front
  return dados.map((v: any) => ({
    id: v.id,
    data: v.createdAt, 
    total: v.total,
    status: v.status || 'Finalizado',
    itens: v.itens.map((i: any) => ({
      nome: i.produto.nome,
      quantidade: i.quantidade,
      preco: Number(i.produto.preco)
    })),
  }));
}
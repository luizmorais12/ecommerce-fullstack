
Loja virtual completa, desenvolvida com **Next.js** no frontend e **NestJS** no backend, com integração via **TypeORM** e persistência local do carrinho usando **LocalStorage**.  

## 📁 Estrutura do Projeto

/
├─ backend/ # Servidor NestJS
│ ├─ src/
│ │ ├─ entities/ # Entidades (Produto, Venda, ItemVenda)
│ │ ├─ modules/ # Módulos (Produtos, Vendas, Carrinho)
│ │ ├─ services/ # Serviços de lógica (ProdutosService, VendasService)
│ │ └─ main.ts # Inicialização do servidor
├─ frontend/ # Aplicação Next.js
│ ├─ pages/ # Páginas (Home, Produtos, Carrinho, Histórico)
│ ├─ components/ # Componentes (Navbar, CarrinhoItem, ProdutoCard)
│ ├─ lib/ # Funções de API (api.ts)
│ ├─ styles/ # CSS global e módulos
│ └─ public/ # Imagens e assets
├─ README.md

yaml
Copiar código

---

## 💾 Estrutura do Banco de Dados

### Tabela: `produto`

| Campo      | Tipo          | Observações                  |
|------------|---------------|------------------------------|
| id         | int (PK)      | Auto-increment               |
| nome       | varchar       | Nome do produto              |
| preco      | decimal       | Preço unitário               |
| estoque    | int           | Quantidade disponível        |
| imagem     | varchar       | URL da imagem                |

### Tabela: `venda`

| Campo        | Tipo          | Observações                  |
|--------------|---------------|------------------------------|
| id           | int (PK)      | Auto-increment               |
| usuarioId    | int           | ID do usuário                |
| total        | decimal       | Valor total da venda         |
| status       | varchar       | "Finalizada", "Pendente", etc |
| data         | timestamp     | Data da criação da venda     |

### Tabela: `item_venda`

| Campo       | Tipo          | Observações                       |
|-------------|---------------|-----------------------------------|
| id          | int (PK)      | Auto-increment                     |
| vendaId     | int (FK)      | Relacionamento com `venda`        |
| produtoId   | int (FK)      | Relacionamento com `produto`      |
| quantidade  | int           | Quantidade comprada                |
| preco       | decimal       | Preço do produto na venda          |

**Relacionamentos:**

- `Venda` 1:N `ItemVenda`  
- `Produto` 1:N `ItemVenda`  

## ⚙ Funcionalidades

### Frontend

- Listagem de produtos (home ou `/produtos`)  
- Adicionar/remover itens do carrinho  
- Atualizar quantidade de produtos no carrinho  
- Cupons de desconto (`DESCONTO10`, `DESCONTO20`)  
- Cálculo de subtotal, frete e total final  
- Finalizar compra (limpa carrinho e registra venda)  
- Histórico de compras (`/historico`) com data, itens, total e status  
- Componentes reutilizáveis: `Navbar`, `ProdutoCard`, `CarrinhoItem`  
- Feedback visual com `react-toastify`  
- Responsivo para desktop e mobile  

### Backend

- CRUD de produtos  
- Carrinho de compras temporário por usuário  
- Finalização de compra  
- Registro e listagem de vendas  
- Histórico de compras por usuário  
- Serviços NestJS (`ProdutosService`, `VendasService`) com TypeORM  

---

## 🛠 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| POST | `/carrinho` | Adiciona produto ao carrinho |
| PUT | `/carrinho` | Atualiza quantidade no carrinho |
| POST | `/carrinho/finalizar-compra` | Finaliza compra |
| GET | `/vendas` | Lista histórico de todas as vendas |
| GET | `/vendas/usuario/:id` | Histórico de um usuário específico |

## ⚡ Como Rodar

### Backend (NestJS)

```bash
cd backend
npm install
# configurar banco de dados em ormconfig.json ou .env
npm run start:dev
API disponível em http://localhost:3001

Frontend (Next.js)
bash
Copiar código
cd frontend
npm install
npm run dev
App disponível em http://localhost:3000

🎨 UI e Estilo
Layout baseado em grid e flexbox
Navbar e botões com cores em degradê azul
Botões arredondados e sombras suaves
Componentes consistentes e reutilizáveis

💡 Observações
O botão de adicionar (+) é desabilitado quando ultrapassa o estoque do produto
Frete grátis acima de R$100
Alertas e notificações via react-toastify
Histórico mostra data, total, status e detalhes dos itens

🔧 Melhorias Futuras
Sistema de login e autenticação de usuários
Dashboard administrativo para produtos e vendas
Integração com gateway de pagamento real
Filtros, categorias e ordenação de produtos
Notificações por email ao finalizar compras

📌 Uso
Adicione produtos ao carrinho

Atualize quantidades ou remova produtos

Aplique cupom de desconto se disponível

Clique em Finalizar Compra

Visualize seu histórico de compras em /historico
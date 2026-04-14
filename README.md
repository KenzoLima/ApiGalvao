# 🎸 API Galvão - Catálogo de Produtos

Uma API RESTful desenvolvida em Node.js para gerenciamento de catálogo de produtos (focado em instrumentos musicais e acessórios). Este projeto implementa operações CRUD completas, com validação rigorosa de dados e persistência em banco de dados relacional.

## 🛠 Tecnologias Utilizadas
- **Node.js** com **Express** (Framework Web)
- **SQL Server** (Banco de dados relacional via pacote `mssql`)
- **Express-Validator** (Sanitização e validação de payloads)
- **Nodemon** (Ambiente de desenvolvimento)

## ⚙️ Pré-requisitos e Execução Local

1. Clone o repositório:
   -bash
   git clone [https://github.com/KenzoLima/ApiGalvao.git](https://github.com/KenzoLima/ApiGalvao.git)
   cd ApiGalvao

2. Instale a dependências:
   -bash
   npm install
   
4. Configure o banco de dados
  Certifique-se de ter o SQL Server rodando localmente.

  O arquivo database.js contém a string de conexão (usuário, senha e banco).
  
6. Inicie o servidor:
   npm run dev

   
Implementação do SQLServer:
<img width="931" height="516" alt="image" src="https://github.com/user-attachments/assets/9c2890a3-310c-499e-b5b3-0d71f493f1d9" />

Update dos preços:
<img width="635" height="171" alt="image" src="https://github.com/user-attachments/assets/22632b73-120e-48b2-9f68-5da6a537dfd3" />

Testes do Post:
<img width="1918" height="1021" alt="Captura de tela 2026-03-23 173422" src="https://github.com/user-attachments/assets/362a92d4-db7b-4e85-be60-77275986fd34" />

Teste de validação dos preços:
<img width="1919" height="1015" alt="Captura de tela 2026-03-23 174546" src="https://github.com/user-attachments/assets/1889568f-2076-4bbf-9e92-cc44e485b617" />

<img width="1919" height="1019" alt="Captura de tela 2026-03-23 174654" src="https://github.com/user-attachments/assets/bf4b4eed-1b08-414d-8e7c-656b6ae7cb93" />

Validação de Produto já cadastrado:
<img width="1918" height="1020" alt="image" src="https://github.com/user-attachments/assets/f585a518-ffee-4981-8f36-1803d4724052" />

Teste de listagem geral:
<img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/b987e306-c9b5-44ca-b138-f8e7fe45a29e" />

Teste de erro de tipagem:
<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/30d868b3-8818-4f95-8135-6f00a1fa4e2c" />






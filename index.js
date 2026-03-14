// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

// 3. Definir porta
const PORT = 3000;

// 4. Middleware para JSON
app.use(express.json());

// 5. Criar primeiro endpoint
app.get('/', (req, res) => {
    res.json({
        mensagem: '🎉 Minha primeira API funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// 6. Endpoint de informações
app.get('/info', (req, res) => {
    res.json({
        nome: 'Minha API REST',
        versao: '1.0.0',
        autor: 'Seu Nome'
    });
});

//IMPLEMENTAÇÃO AULA 4
let produtos = [
    {id: 1, nome: "Bagulhão", preco: 3500, categoria: "MEMES"},
    {id: 2, noem: "Six Senven", preco:67.90, categoria: "MEMES"}
];

let proximoId = 3; //Controla o proximo ID

// POST/API/produtos - criar novo produto
app.post('/api/produtos', (req, res) => {
    //1. pegar dados do body
    const { nome, preco, categoria } = req.body;

    //2. criar objeto do novo produto
    const novoProduto = {
        id: proximoId,
        nome,
        preco,
        categoria
    };

    //3. Adicionar array
    produtos.push(novoProduto);

    //4. Retornar produto criado com status 201
    res.status(201).json(novoProduto);
});

// 7. Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
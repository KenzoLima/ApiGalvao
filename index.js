// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

const { v4: uuidv4 } = require('uuid');
const novoId = uuidv4();

app.use(express.json()); // Middleware essencial - sempre adicionar no começo

let produtos = [
    { id: 1, nome: "Les Paul", preco: 3500, categoria: "Guitarras", estoque: 6 },
    { id: 2, nome: "Super Strato", preco: 2800, categoria: "Guitarras", estoque: 3 },
    { id: 3, nome: "Daddario 0.11", preco: 40, categoria: "Cordas", estoque: 30 },
    { id: 4, nome: "Glock", preco: 15000, categoria: "Brinquedos", estoque: 3 }
];

let categorias = [
    { id: uuidv4(), nome: "Guitarras" },
    { id: uuidv4(), nome: "Cordas" },
    { id: uuidv4(), nome: "Brinquedos" }
];

let usuarios = [
    { id: uuidv4(), nome: "Admin", email: "admin@api.com" }
];

let vendas = [];

app.get('/api/produtos', (req, res) => {
    const { categoria, preco_max, preco_min, ordem, direcao, pagina = 1, limite = 10 } = req.query;

    let resultado = produtos;

    if (categoria) resultado = resultado.filter(p => p.categoria === categoria);
    if (preco_max) resultado = resultado.filter(p => p.preco <= parseFloat(preco_max));
    if (preco_min) resultado = resultado.filter(p => p.preco >= parseFloat(preco_min));

    if (ordem) {
        resultado = resultado.sort((a, b) => {
            if (ordem === 'preco') {
                return direcao === 'desc' ? b.preco - a.preco : a.preco - b.preco;
            }
            if (ordem === 'nome') {
                return direcao === 'desc' ? b.nome.localeCompare(a.nome) : a.nome.localeCompare(b.nome);
            }
        });
    }

    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);

    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

app.get('/api/produtos/:d', (req, res) =>{
    const produto = produtos.find(p => p.id == req.params.id);
    if (!produto) return res.status(404).json({erro: "Produto não encontrado"});
    res.json(produto);
});


app.post
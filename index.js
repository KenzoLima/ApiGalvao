const express = require('express');
const { sql, poolPromise } = require('./database');
const app = express();

app.use(express.json());

// --- ROTAS DA API ---

// 1. LISTAR TODOS (GET)
app.get('/api/produtos', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Produtos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// 2. BUSCAR POR ID (GET)
app.get('/api/produtos/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Produtos WHERE id = @id');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ erro: "Produto não encontrado" });
        }
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// 3. CRIAR NOVO (POST)
app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, preco, categoria, estoque } = req.body;
        const pool = await poolPromise;
        
        await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('preco', sql.Decimal(10, 2), preco)
            .input('cat', sql.NVarChar, categoria)
            .input('est', sql.Int, estoque)
            .query('INSERT INTO Produtos (nome, preco, categoria, estoque) VALUES (@nome, @preco, @cat, @est)');

        res.status(201).json({ mensagem: "Produto criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// 4. DELETAR (DELETE)
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Produtos WHERE id = @id');

        res.json({ mensagem: "Produto removido!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
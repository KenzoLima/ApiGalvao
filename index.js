const express = require('express');
const { body, validationResult } = require('express-validator');
const { sql, poolPromise } = require('./database');

const app = express();
app.use(express.json());

const validarItem = [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('marca').trim().notEmpty().withMessage('Marca é obrigatória.'),
    body('tipo').isIn(['Elétrica', 'Acústica', 'Pedal', 'Acessório', 'Amplificador']).withMessage('Tipo de item inválido.'),
    body('preco').isFloat({ gt: 0 }).withMessage('O preço deve ser maior que zero.'),
    body('estoque').isInt({ min: 0 }).withMessage('Estoque não pode ser negativo.')
];

// 1. GET - Listar todo o estoque
app.get('/api/kenzoguitars', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM KenzoGuitars');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ erro: "Falha ao buscar itens", detalhes: err.message });
    }
});

// 2. GET - Buscar item específico por ID
app.get('/api/kenzoguitars/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM KenzoGuitars WHERE id = @id');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ erro: "Item não encontrado." });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro interno", detalhes: err.message });
    }
});

// 3. POST - Cadastrar novo item
app.post('/api/kenzoguitars', validarItem, async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });

    try {
        const { nome, marca, tipo, preco, estoque } = req.body;
        const pool = await poolPromise;
        
        await pool.request()
            .input('nome', sql.NVarChar, nome)
            .input('marca', sql.NVarChar, marca)
            .input('tipo', sql.NVarChar, tipo)
            .input('preco', sql.Decimal(10, 2), preco)
            .input('estoque', sql.Int, estoque)
            .query('INSERT INTO KenzoGuitars (nome, marca, tipo, preco, estoque) VALUES (@nome, @marca, @tipo, @preco, @estoque)');
        
        res.status(201).json({ mensagem: "Item adicionado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro no cadastro", detalhes: err.message });
    }
});

// 4. PUT - Atualizar item existente
app.put('/api/kenzoguitars/:id', validarItem, async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });

    try {
        const { nome, marca, tipo, preco, estoque } = req.body;
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.NVarChar, nome)
            .input('marca', sql.NVarChar, marca)
            .input('tipo', sql.NVarChar, tipo)
            .input('preco', sql.Decimal(10, 2), preco)
            .input('estoque', sql.Int, estoque)
            .query(`
                UPDATE KenzoGuitars 
                SET nome = @nome, marca = @marca, tipo = @tipo, preco = @preco, estoque = @estoque 
                WHERE id = @id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ mensagem: "Item atualizado com sucesso!" });
        } else {
            res.status(404).json({ erro: "Item não encontrado para atualização." });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar", detalhes: err.message });
    }
});

// 5. DELETE - Remover item
app.delete('/api/kenzoguitars/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM KenzoGuitars WHERE id = @id');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ mensagem: "Item removido com sucesso!" });
        } else {
            res.status(404).json({ erro: "Item não encontrado para remoção." });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro ao remover", detalhes: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Guitar Shop API em http://localhost:${PORT}`));
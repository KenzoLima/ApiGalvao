const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { sql, poolPromise } = require('./database');

const app = express();
app.use(express.json());

// Validações POST e PUT
const validarItem = [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('marca').trim().notEmpty().withMessage('Marca é obrigatória.'),
    body('tipo').isIn(['Elétrica', 'Acústica', 'Pedal', 'Acessório', 'Amplificador']).withMessage('Tipo de item inválido.'),
    body('preco').isFloat({ gt: 0 }).withMessage('O preço deve ser maior que zero.'),
    body('estoque').isInt({ min: 0 }).withMessage('Estoque não pode ser negativo.')
];

// 1. GET 
app.get('/api/kenzoguitars', [
    query('pagina').optional().isInt({ min: 1 }).toInt(),
    query('limite').optional().isInt({ min: 1 }).toInt(),
    query('ordem').optional().isIn(['ASC', 'DESC']).toArray()
], async (req, res) => {
    try {
        const { tipo, marca, pagina = 1, limite = 10, ordenarPor = 'nome', ordem = 'ASC' } = req.query;
        const offset = (pagina - 1) * limite;
        
        const pool = await poolPromise;
        let queryStr = `
            SELECT * FROM KenzoGuitars 
            WHERE (@tipo IS NULL OR tipo = @tipo)
              AND (@marca IS NULL OR marca LIKE '%' + @marca + '%')
            ORDER BY ${ordenarPor === 'preco' ? 'preco' : 'nome'} ${ordem}
            OFFSET @offset ROWS FETCH NEXT @limite ROWS ONLY
        `;

        const result = await pool.request()
            .input('tipo', sql.NVarChar, tipo || null)
            .input('marca', sql.NVarChar, marca || null)
            .input('offset', sql.Int, offset)
            .input('limite', sql.Int, limite)
            .query(queryStr);

        res.status(200).json({
            pagina,
            itensRetornados: result.recordset.length,
            dados: result.recordset
        });
    } catch (err) {
        res.status(500).json({ erro: "Erro na listagem", detalhes: err.message });
    }
});

// 2. GET 
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

// 3. POST 
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
        
        res.status(201).json({ mensagem: "Item de guitarra cadastrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro no cadastro", detalhes: err.message });
    }
});

// 4. PUT   
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
            res.status(200).json({ mensagem: "Estoque atualizado com sucesso!" });
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
app.listen(PORT, () => console.log(`Guitar Shop API (SQL Server) em http://localhost:${PORT}`));
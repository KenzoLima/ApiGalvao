const express = require('express');
const { body, validationResult } = require('express-validator');
const { sql, poolPromise } = require('./database');
const app = express();

app.use(express.json());

// Validações
const validarItem = [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('marca').trim().notEmpty().withMessage('Marca é obrigatória.'),
    body('tipo').isIn(['Elétrica', 'Acústica', 'Pedal', 'Acessório', 'Amplificador']),
    body('preco').isFloat({ gt: 0 }).withMessage('O preço deve ser maior que zero.'),
    body('estoque').isInt({ min: 0 }).withMessage('Estoque não pode ser negativo.')
];

// CRUD
app.get('/api/guitarras', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Guitarras');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ erro: "Falha ao buscar itens", detalhes: err.message });
    }
});

app.post('/api/guitarras', validarItem, async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });

    try {
        const { nome, marca, tipo, preco, estoque } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('n', sql.NVarChar, nome).input('m', sql.NVarChar, marca)
            .input('t', sql.NVarChar, tipo).input('p', sql.Decimal(10, 2), preco)
            .input('e', sql.Int, estoque)
            .query('INSERT INTO Guitarras VALUES (@n, @m, @t, @p, @e)');
        res.status(201).json({ mensagem: "Item de guitarra adicionado!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro no cadastro", detalhes: err.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Guitar Shop API em http://localhost:${PORT}`));
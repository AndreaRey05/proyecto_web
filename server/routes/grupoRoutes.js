const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const db          = require('../db')

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM grupo')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener grupos' })
    }
})

module.exports = router
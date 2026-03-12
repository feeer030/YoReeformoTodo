const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..')));

// Configuración de Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCPEpfoT2ZnCL0eT36xDb2xizl87X2JfE0");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Eres el asistente experto de 'YoReformoTodo', una empresa de reformas integrales en España con 20 años de experiencia. Tu objetivo es ser amable, profesional y ayudar a los clientes con dudas sobre sus proyectos de reforma (cocinas, baños, locales, etc.). Siempre debes animar al usuario a dejar su contacto para un presupuesto gratuito, pero primero responde a sus dudas técnicas o de diseño. Mantén tus respuestas breves y directas."
});

// Database Configuration
let db;
const useMySQL = process.env.DB_HOST ? true : false;

if (useMySQL) {
    const mysql = require('mysql2');
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    db.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL:', err.message);
        } else {
            console.log('Connected to the MySQL database (Hostinger Ready).');
            db.query(`CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                contact_info TEXT NOT NULL,
                context TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'new'
            )`);
        }
    });
} else {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.resolve(__dirname, 'contacts.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening SQLite database', err.message);
        } else {
            console.log('Connected to the SQLite database (Local Development).');
            db.run(`CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contact_info TEXT NOT NULL,
                context TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'new'
            )`);
        }
    });
}

// API Routes

// GET all contacts
app.get('/api/contacts', (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
    if (useMySQL) {
        db.query(sql, (err, rows) => {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "success", "data": rows });
        });
    } else {
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "success", "data": rows });
        });
    }
});

// POST a new contact
app.post('/api/contacts', (req, res) => {
    const { contact_info, context } = req.body;
    if (!contact_info) return res.status(400).json({ "error": "Contact info is required" });

    const sql = 'INSERT INTO contacts (contact_info, context) VALUES (?, ?)';
    const params = [contact_info, context || 'Captured by AI Bot'];
    
    if (useMySQL) {
        db.query(sql, params, function(err, result) {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "success", "data": { id: result.insertId, contact_info, context } });
        });
    } else {
        db.run(sql, params, function(err) {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "success", "data": { id: this.lastID, contact_info, context } });
        });
    }
});

// Mark contact as read/contacted
app.put('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const sql = 'UPDATE contacts SET status = ? WHERE id = ?';
    const params = [status || 'contacted', id];

    if (useMySQL) {
        db.query(sql, params, (err) => {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ message: "success", data: { id, status } });
        });
    } else {
        db.run(sql, params, function(err) {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ message: "success", data: { id, status } });
        });
    }
});

// Ruta para el Chat Inteligente con IA
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    try {
        const result = await model.generateContent(message);
        const responseText = result.response.text();
        res.json({ reply: responseText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "Lo siento, mi conexión cerebral está fallando. ¿Podrías repetirme eso o dejar tu contacto directamente?" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

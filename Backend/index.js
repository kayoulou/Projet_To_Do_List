const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// 🔁 Fonction de test/retry de la connexion PostgreSQL
async function testConnection(retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Connexion réussie à PostgreSQL !");
      return;
    } catch (err) {
      console.error("⛔ Échec connexion PostgreSQL :", err.message);
      retries--;
      if (retries === 0) {
        console.error("❌ Tentatives épuisées. Arrêt du serveur.");
        process.exit(1);
      }
      console.log(`🔁 Nouvelle tentative dans ${delay / 1000}s (${retries} restantes)`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Routes
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "T_todo" ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur GET /tasks :", err.message);
    res.status(500).send("Erreur serveur");
  }
});

app.post("/tasks", async (req, res) => {
  const { title, statut } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).send("Le champ title est requis");
  }
  try {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO "T_todo"(id, title, statut, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [id, title, statut || "à faire"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur POST /tasks :", err.message);
    res.status(500).send("Erreur serveur");
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, statut } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).send("Le champ title est requis");
  }
  try {
    const result = await pool.query(
      'UPDATE "T_todo" SET title = $1, statut = $2 WHERE id = $3 RETURNING *',
      [title, statut || "à faire", id]
    );
    if (result.rowCount === 0) return res.status(404).send("Tâche non trouvée");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur PUT /tasks/:id :", err.message);
    res.status(500).send("Erreur serveur");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "T_todo" WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).send("Tâche non trouvée");
    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur DELETE /tasks/:id :", err.message);
    res.status(500).send("Erreur serveur");
  }
});

// 🚀 Lancement après test de connexion
(async () => {
  await testConnection(); // attend que PostgreSQL soit prêt
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Serveur démarré sur le port ${port}`);
  });
})();

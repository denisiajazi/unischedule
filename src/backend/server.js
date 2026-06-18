// server.js — pika hyrëse e aplikacionit (Express)
const express = require("express");
const path = require("path");
const { gjeneroOrarin } = require("./controller");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../docs")));

// Endpoint: gjeneron orarin për një semestër
app.post("/api/orari/:semestriId/gjenero", gjeneroOrarin);

// Endpoint: kthen orarin e ruajtur
app.get("/api/orari/:semestriId", async (req, res) => {
  try {
    const caktimet = await db.query(
      `SELECT c.*, l.emri AS lendaEmri, p.emri AS pedagogEmri,
              s.emri AS sallaEmri, b.dita, b.ora, g.emri AS grupEmri
       FROM caktimet c
       JOIN lendet l ON c.lendaId = l.id
       JOIN perdoruesit p ON c.pedagogId = p.id
       JOIN sallat s ON c.sallaId = s.id
       JOIN brezat b ON c.brezId = b.id
       JOIN grupet g ON c.grupId = g.id
       WHERE c.semestriId = ?`, [req.params.semestriId]);
    res.json({ caktimet });
  } catch (gabim) {
    res.status(500).json({ sukses: false, mesazhi: gabim.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`UniSchedule në http://localhost:${PORT}`));

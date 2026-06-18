const { optimizoOrarin, KONFIG_STANDARD } = require("./optimizer");
const db = require("./db");

// Mbledh të gjitha burimet e nevojshme nga baza e të dhënave për një semestër.
async function mbledhBurimet(semestriId) {
  const [lendet, sallat, brezat, grupet] = await Promise.all([
    db.query("SELECT * FROM lendet WHERE semestriId = ?", [semestriId]),
    db.query("SELECT * FROM sallat"),
    db.query("SELECT * FROM brezat"),
    db.query("SELECT * FROM grupet WHERE semestriId = ?", [semestriId])
  ]);
  return { lendet, sallat, brezat, grupet };
}

// Mbledh kufizimet (preferencat, kapacitetet) për funksionin e përshtatshmërisë.
async function mbledhKufizimet(semestriId) {
  const preferencat = await db.query(
    "SELECT * FROM preferencat WHERE semestriId = ?", [semestriId]);
  const sallat = await db.query("SELECT * FROM sallat");
  const grupet = await db.query(
    "SELECT * FROM grupet WHERE semestriId = ?", [semestriId]);
  return {
    preferencat: indeksoSipasId(preferencat, "pedagogId"),
    sallat: indeksoSipasId(sallat, "id"),
    grupet: indeksoSipasId(grupet, "id")
  };
}

function indeksoSipasId(rreshtat, fusha) {
  const map = {};
  for (const r of rreshtat) map[r[fusha]] = r;
  return map;
}

// Ruan orarin e gjeneruar në bazën e të dhënave brenda një transaksioni.
async function ruajOrarin(semestriId, orari) {
  const lidhja = await db.fillimoTransaksion();
  try {
    await lidhja.query("DELETE FROM caktimet WHERE semestriId = ?", [semestriId]);
    for (const c of orari.caktimet) {
      await lidhja.query(
        `INSERT INTO caktimet (semestriId, lendaId, pedagogId, sallaId, brezId, grupId)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [semestriId, c.lendaId, c.pedagogId, c.sallaId, c.brezId, c.grupId]);
    }
    await lidhja.commit();
  } catch (gabim) {
    await lidhja.rollback();
    throw gabim;
  } finally {
    lidhja.release();
  }
}

// Endpoint-i kryesor: gjeneron dhe ruan orarin për një semestër.
async function gjeneroOrarin(req, res) {
  try {
    const burimet = await mbledhBurimet(req.params.semestriId);
    const kufizimet = await mbledhKufizimet(req.params.semestriId);
    const orari = optimizoOrarin(burimet, kufizimet, KONFIG_STANDARD);
    await ruajOrarin(req.params.semestriId, orari);
    res.json({ sukses: true, pershtatshmeria: orari.pershtatshmeria,
               numriCaktimeve: orari.caktimet.length });
  } catch (gabim) {
    res.status(500).json({ sukses: false, mesazhi: gabim.message });
  }
}

module.exports = { gjeneroOrarin, mbledhBurimet, mbledhKufizimet, ruajOrarin };

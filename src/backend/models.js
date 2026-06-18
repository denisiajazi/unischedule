// Përfaqësimi i një caktimi të vetëm në orar
class Caktimi {
  constructor(lendaId, pedagogId, sallaId, brezId, grupId) {
    this.lendaId = lendaId;
    this.pedagogId = pedagogId;
    this.sallaId = sallaId;
    this.brezId = brezId;
    this.grupId = grupId;
  }
}

// Një zgjidhje e plotë: varg caktimesh + vlera e ruajtur e përshtatshmërisë
class Zgjidhja {
  constructor(caktimet) {
    this.caktimet = caktimet;
    this.pershtatshmeria = null;
  }
}

function klononCaktimin(c) {
  return new Caktimi(c.lendaId, c.pedagogId, c.sallaId, c.brezId, c.grupId);
}

function klononZgjidhjen(z) {
  const e = new Zgjidhja(z.caktimet.map(klononCaktimin));
  e.pershtatshmeria = z.pershtatshmeria;
  return e;
}

module.exports = { Caktimi, Zgjidhja, klononCaktimin, klononZgjidhjen };

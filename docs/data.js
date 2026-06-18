/* Të dhëna shembull për demonstrim — një instancë e vogël realiste. */
const TE_DHENAT = {
  brezat: [
    { id: 1, dita: "Hënë", ora: "09:00" }, { id: 2, dita: "Hënë", ora: "11:00" },
    { id: 3, dita: "Martë", ora: "09:00" }, { id: 4, dita: "Martë", ora: "11:00" },
    { id: 5, dita: "Mërkurë", ora: "09:00" }, { id: 6, dita: "Mërkurë", ora: "11:00" },
    { id: 7, dita: "Enjte", ora: "09:00" }, { id: 8, dita: "Enjte", ora: "11:00" },
  ],
  sallat: [
    { id: 1, emri: "Salla A", kapaciteti: 60 }, { id: 2, emri: "Salla B", kapaciteti: 40 },
    { id: 3, emri: "Salla C", kapaciteti: 30 },
  ],
  pedagoget: [
    { id: 1, emri: "Prof. Hoxha" }, { id: 2, emri: "Dr. Leka" },
    { id: 3, emri: "MSc. Dervishi" }, { id: 4, emri: "Prof. Berisha" },
  ],
  grupet: [
    { id: 1, emri: "IE-Viti I", numriStudenteve: 55 },
    { id: 2, emri: "IE-Viti II", numriStudenteve: 35 },
    { id: 3, emri: "IE-Viti III", numriStudenteve: 28 },
  ],
  lendet: [
    { id: 1, emri: "Algoritmika", pedagogId: 1, grupId: 1 },
    { id: 2, emri: "Bazat e të Dhënave", pedagogId: 2, grupId: 1 },
    { id: 3, emri: "Programim Web", pedagogId: 3, grupId: 1 },
    { id: 4, emri: "Statistikë", pedagogId: 4, grupId: 1 },
    { id: 5, emri: "Inteligjencë Artificiale", pedagogId: 1, grupId: 2 },
    { id: 6, emri: "Rrjeta Kompjuterike", pedagogId: 2, grupId: 2 },
    { id: 7, emri: "Inxhinieri Softueri", pedagogId: 3, grupId: 2 },
    { id: 8, emri: "Siguria Kibernetike", pedagogId: 4, grupId: 2 },
    { id: 9, emri: "Optimizim", pedagogId: 1, grupId: 3 },
    { id: 10, emri: "Sisteme të Shpërndara", pedagogId: 2, grupId: 3 },
    { id: 11, emri: "Mining i të Dhënave", pedagogId: 3, grupId: 3 },
    { id: 12, emri: "Menaxhim Projektesh", pedagogId: 4, grupId: 3 },
  ],
};
// Kufizimet e buta: preferencat (brezat që pedagogu parapëlqen t’i shmangë)
const KUFIZIMET = {
  preferencat: { 1: [8], 2: [1], 3: [], 4: [7, 8] },
  sallat: { 1: 60, 2: 40, 3: 30 },
  grupet: { 1: 55, 2: 35, 3: 28 },
};
const BURIMET = {
  lendet: TE_DHENAT.lendet, sallat: TE_DHENAT.sallat,
  brezat: TE_DHENAT.brezat, grupet: TE_DHENAT.grupet,
};
// Harta ndihmëse emër<-id
const HARTA = {
  lenda: Object.fromEntries(TE_DHENAT.lendet.map(l => [l.id, l.emri])),
  pedagog: Object.fromEntries(TE_DHENAT.pedagoget.map(p => [p.id, p.emri])),
  salla: Object.fromEntries(TE_DHENAT.sallat.map(s => [s.id, s.emri])),
  brez: Object.fromEntries(TE_DHENAT.brezat.map(b => [b.id, b.dita + " " + b.ora])),
  grup: Object.fromEntries(TE_DHENAT.grupet.map(g => [g.id, g.emri])),
};

/* test/test_motori.js — teste njësie për motorin GA-SA
   Ekzekuto me: node test/test_motori.js          */

// Ngarko motorin dhe të dhënat
const { konfliktet, llogaritPershtatshmerine,
        gjeneroPopullateFillestare } = require("../docs/engine_node");

let kaluara = 0, deshtuar = 0;

function pohoj(etiketa, kushti) {
  if (kushti) {
    console.log(`  ✓  ${etiketa}`);
    kaluara++;
  } else {
    console.error(`  ✗  ${etiketa}`);
    deshtuar++;
  }
}

// ---- Të dhëna minimale për testim ----
const burimet = {
  lendet:    [{ id: 1, pedagogId: 1, grupId: 1 }, { id: 2, pedagogId: 1, grupId: 2 }],
  sallat:    [{ id: 1 }, { id: 2 }],
  brezat:    [{ id: 1 }, { id: 2 }],
  grupet:    [{ id: 1 }, { id: 2 }],
};
const kufizimet = {
  preferencat: { 1: [], 2: [] },
  sallat: { 1: 30, 2: 50 },
  grupet: { 1: 25, 2: 40 },
};

// ---- Suite 1: zbulimi i konflikteve ----
console.log("\nSuite 1 — Zbulimi i konflikteve");

// Ngjaj një zgjidhje me konflikt të qëllimshëm (dy lëndë, i njëjti brez+pedagog)
const { Caktimi, Zgjidhja } = require("../docs/engine_node");
const zKonflikt = new Zgjidhja([
  new Caktimi(1, 1, 1, 1, 1),   // lenda1, pedagog1, salla1, brez1, grup1
  new Caktimi(2, 1, 2, 1, 2),   // lenda2, pedagog1, salla2, brez1, grup2 — konflikt pedagog!
]);

pohoj("zbulon konflikt pedagogu",
  konfliktet(zKonflikt) === 1);

// Zgjidhje pa konflikt
const zPaster = new Zgjidhja([
  new Caktimi(1, 1, 1, 1, 1),
  new Caktimi(2, 2, 2, 2, 2),
]);
pohoj("nuk raporton konflikt te orari i pastër",
  konfliktet(zPaster) === 0);

// ---- Suite 2: gjenerimi i popullatës ----
console.log("\nSuite 2 — Gjenerimi i popullatës fillestare");

const pop = gjeneroPopullateFillestare(10, burimet);
pohoj("gjeneron madhësinë e saktë të popullatës", pop.length === 10);
pohoj("çdo individ ka numrin e duhur të caktimeve",
  pop.every(z => z.caktimet.length === burimet.lendet.length));

// ---- Suite 3: funksioni i përshtatshmërisë ----
console.log("\nSuite 3 — Funksioni i përshtatshmërisë");

const pKonflikt = llogaritPershtatshmerine(zKonflikt, kufizimet);
const pPaster   = llogaritPershtatshmerine(zPaster,   kufizimet);
pohoj("orari pa konflikt ka përshtatshmëri më të lartë",
  pPaster > pKonflikt);
pohoj("përshtatshmëria është ≥ 0", pKonflikt >= 0 && pPaster >= 0);

// ---- Rezyme ----
console.log(`\nRezyme: ${kaluara} kaluan, ${deshtuar} dështuan.\n`);
if (deshtuar > 0) process.exit(1);

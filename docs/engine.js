/* UniSchedule — Motori i optimizimit GA-SA (versioni demonstrues për shfletues)
   Ekzekutohet plotësisht në shfletues. Bazohet në kodin e Shtojcës 2 të punimit. */

// ---------- Modelet ----------
class Caktimi {
  constructor(lendaId, pedagogId, sallaId, brezId, grupId) {
    this.lendaId = lendaId; this.pedagogId = pedagogId;
    this.sallaId = sallaId; this.brezId = brezId; this.grupId = grupId;
  }
}
class Zgjidhja {
  constructor(caktimet) { this.caktimet = caktimet; this.pershtatshmeria = null; }
}
const klononCaktimin = c => new Caktimi(c.lendaId, c.pedagogId, c.sallaId, c.brezId, c.grupId);
function klononZgjidhjen(z) {
  const e = new Zgjidhja(z.caktimet.map(klononCaktimin));
  e.pershtatshmeria = z.pershtatshmeria; return e;
}

// ---------- Funksioni i përshtatshmërisë ----------
function numeroKonflikteResource(zgjidhja, fusha) {
  const sipasBrezit = {}; let konflikte = 0;
  for (const c of zgjidhja.caktimet) {
    const celes = c.brezId + "_" + c[fusha];
    sipasBrezit[celes] = (sipasBrezit[celes] || 0) + 1;
  }
  for (const k in sipasBrezit) if (sipasBrezit[k] > 1) konflikte += sipasBrezit[k] - 1;
  return konflikte;
}
function numeroShkeljePreferencash(zgjidhja, kuf) {
  let s = 0;
  for (const c of zgjidhja.caktimet) {
    const p = kuf.preferencat[c.pedagogId];
    if (p && p.includes(c.brezId)) s++;
  }
  return s;
}
function numeroMosperputhjeKapaciteti(zgjidhja, kuf) {
  let m = 0;
  for (const c of zgjidhja.caktimet) {
    const salla = kuf.sallat[c.sallaId], grupi = kuf.grupet[c.grupId];
    if (salla && grupi && grupi > salla) m++;
  }
  return m;
}
function konfliktet(zgjidhja) {
  return numeroKonflikteResource(zgjidhja, "pedagogId")
       + numeroKonflikteResource(zgjidhja, "sallaId")
       + numeroKonflikteResource(zgjidhja, "grupId");
}
function llogaritPershtatshmerine(zgjidhja, kuf) {
  let pike = 1000;
  pike -= konfliktet(zgjidhja) * 50;
  pike -= numeroShkeljePreferencash(zgjidhja, kuf) * 8;
  pike -= numeroMosperputhjeKapaciteti(zgjidhja, kuf) * 6;
  return Math.max(0, pike);
}

// ---------- Operatorët gjenetikë ----------
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
function gjeneroPopullateFillestare(madhesia, b) {
  const pop = [];
  for (let i = 0; i < madhesia; i++) {
    const caktimet = b.lendet.map(l =>
      new Caktimi(l.id, l.pedagogId, rnd(b.sallat).id, rnd(b.brezat).id, l.grupId));
    pop.push(new Zgjidhja(caktimet));
  }
  return pop;
}
function seleksiono(pop, k = 3) {
  let best = rnd(pop);
  for (let i = 1; i < k; i++) { const c = rnd(pop); if (c.pershtatshmeria > best.pershtatshmeria) best = c; }
  return best;
}
function kryqezo(p1, p2, norma) {
  if (Math.random() > norma) return klononZgjidhjen(p1);
  const pika = Math.floor(Math.random() * p1.caktimet.length);
  return new Zgjidhja([...p1.caktimet.slice(0, pika).map(klononCaktimin),
                       ...p2.caktimet.slice(pika).map(klononCaktimin)]);
}
function mutacion(z, norma, b) {
  for (const c of z.caktimet) if (Math.random() < norma) {
    c.sallaId = rnd(b.sallat).id; c.brezId = rnd(b.brezat).id;
  }
  z.pershtatshmeria = null; return z;
}

// ---------- Ftohja e simuluar ----------
function gjeneroFqinj(z, b) {
  const f = klononZgjidhjen(z);
  const i = Math.floor(Math.random() * f.caktimet.length);
  f.caktimet[i].sallaId = rnd(b.sallat).id;
  f.caktimet[i].brezId = rnd(b.brezat).id;
  f.pershtatshmeria = null; return f;
}
function ftohjeSimuluar(z, t0, ftohja, kuf, b, hap) {
  let akt = z, eAkt = llogaritPershtatshmerine(akt, kuf), t = t0;
  while (t > 1) {
    const fq = gjeneroFqinj(akt, b), eFq = llogaritPershtatshmerine(fq, kuf), d = eFq - eAkt;
    if (d > 0 || Math.random() < Math.exp(d / t)) { akt = fq; eAkt = eFq; }
    t *= ftohja;
    if (hap) hap(akt, eAkt);
  }
  return akt;
}

// ---------- Orkestruesi hibrid (me callback për animim) ----------
const KONFIG = { madhesia: 50, brezatMax: 120, elita: 4,
  normaKryqezimit: 0.85, normaMutacionit: 0.06, tempFillestare: 800, normaFtohjes: 0.95 };

async function* optimizoOrarin(b, kuf, konfig = KONFIG) {
  let pop = gjeneroPopullateFillestare(konfig.madhesia, b);
  pop.forEach(z => z.pershtatshmeria = llogaritPershtatshmerine(z, kuf));
  pop.sort((a, c) => c.pershtatshmeria - a.pershtatshmeria);
  yield { faza: "fillestare", zgjidhja: pop[0], brezi: 0,
          konflikte: konfliktet(pop[0]), pershtatshmeria: pop[0].pershtatshmeria };

  for (let brezi = 1; brezi <= konfig.brezatMax; brezi++) {
    const teRinj = pop.slice(0, konfig.elita).map(z => z);
    while (teRinj.length < konfig.madhesia) {
      let f = kryqezo(seleksiono(pop), seleksiono(pop), konfig.normaKryqezimit);
      f = mutacion(f, konfig.normaMutacionit, b);
      teRinj.push(f);
    }
    pop = teRinj;
    pop.forEach(z => z.pershtatshmeria = llogaritPershtatshmerine(z, kuf));
    pop.sort((a, c) => c.pershtatshmeria - a.pershtatshmeria);
    if (brezi % 4 === 0 || brezi === konfig.brezatMax) {
      yield { faza: "gjenetik", zgjidhja: pop[0], brezi,
              konflikte: konfliktet(pop[0]), pershtatshmeria: pop[0].pershtatshmeria };
    }
  }
  // Faza e ftohjes së simuluar
  let best = pop[0], hapNr = 0;
  best = ftohjeSimuluar(best, konfig.tempFillestare, konfig.normaFtohjes, kuf, b, null);
  yield { faza: "ftohje", zgjidhja: best, brezi: konfig.brezatMax,
          konflikte: konfliktet(best), pershtatshmeria: llogaritPershtatshmerine(best, kuf) };
}

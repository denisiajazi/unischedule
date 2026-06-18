const { Caktimi } = require("./models");

// Llogarit përshtatshmërinë: nis nga 1000, zbret me penalitete të diferencuara.
function llogaritPershtatshmerine(zgjidhja, kufizimet) {
  let pike = 1000;
  // Kufizimet e rënda — penalitet i lartë (50)
  pike -= numeroKonflikteResource(zgjidhja, "pedagogId") * 50;
  pike -= numeroKonflikteResource(zgjidhja, "sallaId") * 50;
  pike -= numeroKonflikteResource(zgjidhja, "grupId") * 50;
  // Kufizimet e buta — penalitet i ulët (4–8)
  pike -= numeroShkeljePreferencash(zgjidhja, kufizimet) * 8;
  pike -= numeroBoshllequTepert(zgjidhja) * 4;
  pike -= numeroMosperputhjeKapaciteti(zgjidhja, kufizimet) * 6;
  return Math.max(0, pike);
}

// Numëron përdorimet e dyfishta të të njëjtit burim në të njëjtin brez kohor.
function numeroKonflikteResource(zgjidhja, fusha) {
  const sipasBrezit = {};
  let konflikte = 0;
  for (const c of zgjidhja.caktimet) {
    const celes = c.brezId + "_" + c[fusha];
    sipasBrezit[celes] = (sipasBrezit[celes] || 0) + 1;
  }
  for (const celes in sipasBrezit) {
    if (sipasBrezit[celes] > 1) konflikte += sipasBrezit[celes] - 1;
  }
  return konflikte;
}

// Numëron shkeljet e preferencave kohore të pedagogëve.
function numeroShkeljePreferencash(zgjidhja, kufizimet) {
  let shkelje = 0;
  for (const c of zgjidhja.caktimet) {
    const pref = kufizimet.preferencat[c.pedagogId];
    if (pref && pref.brezateShmangur && pref.brezateShmangur.includes(c.brezId)) {
      shkelje++;
    }
  }
  return shkelje;
}

// Numëron boshllëqet e tepërta në orarin ditor të secilit grup.
function numeroBoshllequTepert(zgjidhja) {
  const sipasGrupit = {};
  for (const c of zgjidhja.caktimet) {
    (sipasGrupit[c.grupId] = sipasGrupit[c.grupId] || []).push(c.brezId);
  }
  let boshlleqe = 0;
  for (const grup in sipasGrupit) {
    const brezat = sipasGrupit[grup].sort((a, b) => a - b);
    for (let i = 1; i < brezat.length; i++) {
      const hendek = brezat[i] - brezat[i - 1] - 1;
      if (hendek > 1) boshlleqe += hendek;
    }
  }
  return boshlleqe;
}

// Numëron mospërputhjet midis kapacitetit të sallës dhe numrit të studentëve.
function numeroMosperputhjeKapaciteti(zgjidhja, kufizimet) {
  let mosperputhje = 0;
  for (const c of zgjidhja.caktimet) {
    const salla = kufizimet.sallat[c.sallaId];
    const grupi = kufizimet.grupet[c.grupId];
    if (salla && grupi && grupi.numriStudenteve > salla.kapaciteti) mosperputhje++;
  }
  return mosperputhje;
}

module.exports = {
  llogaritPershtatshmerine, numeroKonflikteResource,
  numeroShkeljePreferencash, numeroBoshllequTepert, numeroMosperputhjeKapaciteti
};

const { klononZgjidhjen } = require("./models");
const { llogaritPershtatshmerine } = require("./fitness");
const { zgjedhSalleTeRastesishme, zgjedhBrezTeRastesishem } = require("./genetic");

// Gjeneron një zgjidhje fqinje duke zhvendosur një caktim të vetëm.
function gjeneroFqinj(zgjidhja, burimet) {
  const fqinje = klononZgjidhjen(zgjidhja);
  const idx = Math.floor(Math.random() * fqinje.caktimet.length);
  fqinje.caktimet[idx].sallaId = zgjedhSalleTeRastesishme(burimet.sallat);
  fqinje.caktimet[idx].brezId = zgjedhBrezTeRastesishem(burimet.brezat);
  fqinje.pershtatshmeria = null;
  return fqinje;
}

// Ftohja e simuluar: rafinon zgjidhjen me kriterin probabilist të pranimit.
function ftohjeSimuluar(zgjidhja, temperaturaFillestare, normaFtohjes, kufizimet, burimet) {
  let aktuale = zgjidhja;
  let energjiaAktuale = llogaritPershtatshmerine(aktuale, kufizimet);
  let temperatura = temperaturaFillestare;
  while (temperatura > 1) {
    const fqinje = gjeneroFqinj(aktuale, burimet);
    const energjiaFqinje = llogaritPershtatshmerine(fqinje, kufizimet);
    const delta = energjiaFqinje - energjiaAktuale;
    // Pranon gjithmonë përmirësimin; pranon përkeqësimin me probabilitet exp(delta/T)
    if (delta > 0 || Math.random() < Math.exp(delta / temperatura)) {
      aktuale = fqinje;
      energjiaAktuale = energjiaFqinje;
    }
    temperatura *= normaFtohjes;
  }
  return aktuale;
}

module.exports = { gjeneroFqinj, ftohjeSimuluar };

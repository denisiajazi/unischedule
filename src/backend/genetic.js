const { Caktimi, Zgjidhja, klononCaktimin, klononZgjidhjen } = require("./models");

// Gjeneron një popullatë fillestare zgjidhjesh të rastësishme por të strukturuara.
function gjeneroPopullateFillestare(madhesia, burimet) {
  const popullata = [];
  for (let i = 0; i < madhesia; i++) {
    const caktimet = burimet.lendet.map(lenda => new Caktimi(
      lenda.id, lenda.pedagogId,
      zgjedhSalleTeRastesishme(burimet.sallat),
      zgjedhBrezTeRastesishem(burimet.brezat),
      lenda.grupId
    ));
    popullata.push(new Zgjidhja(caktimet));
  }
  return popullata;
}

// Seleksionim me turne: zgjedh më të mirën nga k kandidatë të rastësishëm.
function seleksiono(popullata, k = 3) {
  let me_i_miri = popullata[Math.floor(Math.random() * popullata.length)];
  for (let i = 1; i < k; i++) {
    const kandidat = popullata[Math.floor(Math.random() * popullata.length)];
    if (kandidat.pershtatshmeria > me_i_miri.pershtatshmeria) me_i_miri = kandidat;
  }
  return me_i_miri;
}

// Kryqëzim një-pikësh midis dy prindërve.
function kryqezo(prind1, prind2, normaKryqezimit) {
  if (Math.random() > normaKryqezimit) return klononZgjidhjen(prind1);
  const pika = Math.floor(Math.random() * prind1.caktimet.length);
  const caktimetEReja = [
    ...prind1.caktimet.slice(0, pika).map(klononCaktimin),
    ...prind2.caktimet.slice(pika).map(klononCaktimin)
  ];
  return new Zgjidhja(caktimetEReja);
}

// Mutacion: zhvendos disa caktime në salla/breza të tjerë me probabilitet të vogël.
function mutacion(zgjidhja, normaMutacionit, burimet) {
  for (const c of zgjidhja.caktimet) {
    if (Math.random() < normaMutacionit) {
      c.sallaId = zgjedhSalleTeRastesishme(burimet.sallat);
      c.brezId = zgjedhBrezTeRastesishem(burimet.brezat);
    }
  }
  zgjidhja.pershtatshmeria = null;
  return zgjidhja;
}

function zgjedhSalleTeRastesishme(sallat) {
  return sallat[Math.floor(Math.random() * sallat.length)].id;
}
function zgjedhBrezTeRastesishem(brezat) {
  return brezat[Math.floor(Math.random() * brezat.length)].id;
}

module.exports = {
  gjeneroPopullateFillestare, seleksiono, kryqezo, mutacion,
  zgjedhSalleTeRastesishme, zgjedhBrezTeRastesishem
};

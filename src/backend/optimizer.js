const { llogaritPershtatshmerine } = require("./fitness");
const { gjeneroPopullateFillestare, seleksiono, kryqezo, mutacion } = require("./genetic");
const { ftohjeSimuluar } = require("./annealing");

const KONFIG_STANDARD = {
  madhesia: 60, brezatMax: 200, elita: 4,
  normaKryqezimit: 0.85, normaMutacionit: 0.05,
  tempFillestare: 1000, normaFtohjes: 0.97
};

// Motori hibrid: cikël gjenetik me elitizëm, i ndjekur nga rafinimi me ftohje të simuluar.
function optimizoOrarin(burimet, kufizimet, konfig = KONFIG_STANDARD) {
  let popullata = gjeneroPopullateFillestare(konfig.madhesia, burimet);
  for (let brezi = 0; brezi < konfig.brezatMax; brezi++) {
    popullata.forEach(z =>
      z.pershtatshmeria = llogaritPershtatshmerine(z, kufizimet));
    popullata.sort((a, b) => b.pershtatshmeria - a.pershtatshmeria);
    const teRinj = popullata.slice(0, konfig.elita).map(z => z); // elita
    while (teRinj.length < konfig.madhesia) {
      const p1 = seleksiono(popullata);
      const p2 = seleksiono(popullata);
      let femije = kryqezo(p1, p2, konfig.normaKryqezimit);
      femije = mutacion(femije, konfig.normaMutacionit, burimet);
      teRinj.push(femije);
    }
    popullata = teRinj;
  }
  popullata.forEach(z =>
    z.pershtatshmeria = llogaritPershtatshmerine(z, kufizimet));
  popullata.sort((a, b) => b.pershtatshmeria - a.pershtatshmeria);
  // Rafinim përfundimtar i zgjidhjes më të mirë me ftohje të simuluar
  return ftohjeSimuluar(popullata[0], konfig.tempFillestare,
                        konfig.normaFtohjes, kufizimet, burimet);
}

module.exports = { optimizoOrarin, KONFIG_STANDARD };

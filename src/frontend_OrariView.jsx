import React, { useState, useEffect } from "react";

function OrariView({ semestriId }) {
  const [orari, setOrari] = useState([]);
  const [duke_u_gjeneruar, setGjenerimi] = useState(false);
  const [gabim, setGabim] = useState(null);

  useEffect(() => {
    fetch(`/api/orari/${semestriId}`)
      .then(r => r.json())
      .then(te_dhena => setOrari(te_dhena.caktimet || []))
      .catch(() => setGabim("Nuk u ngarkua orari."));
  }, [semestriId]);

  const gjeneroOrarin = async () => {
    setGjenerimi(true); setGabim(null);
    try {
      const pergjigje = await fetch(`/api/orari/${semestriId}/gjenero`, { method: "POST" });
      const rezultat = await pergjigje.json();
      if (rezultat.sukses) {
        const i_ri = await fetch(`/api/orari/${semestriId}`).then(r => r.json());
        setOrari(i_ri.caktimet);
      } else { setGabim(rezultat.mesazhi); }
    } catch (e) { setGabim("Gabim gjatë gjenerimit."); }
    finally { setGjenerimi(false); }
  };

  return (
    <div className="orari-kontejner">
      <button onClick={gjeneroOrarin} disabled={duke_u_gjeneruar}>
        {duke_u_gjeneruar ? "Duke gjeneruar..." : "Gjenero Orarin"}
      </button>
      {gabim && <p className="gabim">{gabim}</p>}
      <TabelaOrarit caktimet={orari} />
    </div>
  );
}

function TabelaOrarit({ caktimet }) {
  return (
    <table className="tabela-orarit">
      <thead>
        <tr>
          <th>Brezi</th><th>Lënda</th><th>Pedagogu</th><th>Salla</th><th>Grupi</th>
        </tr>
      </thead>
      <tbody>
        {caktimet.map((c, i) => (
          <tr key={i}>
            <td>{c.brezEmri}</td><td>{c.lendaEmri}</td>
            <td>{c.pedagogEmri}</td><td>{c.sallaEmri}</td><td>{c.grupEmri}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrariView;

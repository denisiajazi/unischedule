# UniSchedule

**Sistem web me optimizim metaheuristik për menaxhimin inteligjent të orarit të mësimdhënies në institucionet e arsimit të lartë.**

Punim diplome — Master i Shkencave në Informatikë Ekonomike, Universiteti Europian i Tiranës (UET).
Autor: **Denis Ajazi** · Udhëheqëse shkencore: MSc. Anxhela Ferhataj.

---

## Demo live

Versioni demonstrues ekzekutohet tërësisht në shfletues përmes GitHub Pages:

**https://denisiajazi.github.io/unischedule/**

Demoja gjeneron një orar fillestar (me konflikte) dhe pastaj e optimizon me motorin hibrid GA-SA, duke treguar vizualisht se si konfliktet zhduken brez pas brezi.

## Çfarë bën

Ndërtimi i orarit akademik është një problem optimizimi kombinatorial NP-i vështirë: caktimi i lëndëve në salla dhe breza kohorë pa shkelur kufizimet (një pedagog s'mund të jetë në dy vende njëkohësisht, etj.). UniSchedule e zgjidh përmes një **algoritmi hibrid**:

- **Algoritmi gjenetik (GA)** — kërkim global mbi një popullatë zgjidhjesh, me seleksionim, kryqëzim, mutacion dhe elitizëm.
- **Ftohja e simuluar (SA)** — rafinim lokal i zgjidhjes më të mirë, duke pranuar me probabilitet edhe lëvizje të përkohshme më të dobëta për t'i shpëtuar minimumeve lokale.

Rezultatet e punimit: reduktim mesatar ~87% i konflikteve, kohë gjenerimi <2s për instanca të mesme, përdorshmëri SUS 82.3.

## Struktura e projektit

```
unischedule/
├── docs/                  → Demo live (GitHub Pages)
│   ├── index.html         → Ndërfaqja interaktive
│   ├── engine.js          → Motori GA-SA (versioni për shfletues)
│   └── data.js            → Të dhëna shembull
├── src/
│   ├── backend/           → Kodi i plotë Node.js
│   │   ├── models.js      → Modelet e të dhënave
│   │   ├── fitness.js     → Funksioni i përshtatshmërisë
│   │   ├── genetic.js     → Operatorët gjenetikë
│   │   ├── annealing.js   → Ftohja e simuluar
│   │   ├── optimizer.js   → Orkestruesi hibrid
│   │   ├── controller.js  → Kontrollori API
│   │   ├── db.js          → Lidhja MySQL
│   │   └── server.js      → Serveri Express
│   └── frontend_OrariView.jsx  → Komponenti React
├── db/
│   └── skema.sql          → Struktura e bazës së të dhënave
├── test/
│   └── test_motori.js     → Teste bazike
└── package.json
```

## Si ta ekzekutosh lokalisht (backend i plotë)

Kërkon Node.js dhe MySQL.

```bash
# 1. Instalo varësitë
npm install

# 2. Krijo bazën e të dhënave
mysql -u root -p < db/skema.sql

# 3. Konfiguro lidhjen (opsionale, përmes variablave të mjedisit)
export DB_HOST=localhost DB_USER=root DB_PASS=fjalekalimi DB_NAME=unischedule

# 4. Nise serverin
npm start
# → UniSchedule në http://localhost:3000
```

## Teknologjitë

| Shtresa | Teknologjia |
|---------|-------------|
| Ndërfaqja | React.js (SPA) |
| Serveri | Node.js + Express |
| Baza e të dhënave | MySQL |
| Motori | Algoritëm hibrid GA-SA (JavaScript) |

## Licenca

MIT — shih [LICENSE](LICENSE). Përdorim i lirë për qëllime akademike.

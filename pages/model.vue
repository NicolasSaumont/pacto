<template>
  <div class="app">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2>Pacto</h2>
      <nav>
        <ul>
          <li><a href="#">Commandes</a></li>
          <li><a href="#">Clients</a></li>
          <li><a href="#">Produits</a></li>
          <li><a href="#">Synthèse</a></li>
        </ul>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">
      <!-- TOP BAR -->
      <header class="topbar">
        <h1>Tableau de bord</h1>
        <button class="btn-primary">+ Nouvelle commande</button>
      </header>

      <!-- STATS -->
      <section class="stats">
        <div class="stat-card">
          <p class="stat-value">12</p>
          <p class="stat-label">Commandes</p>
        </div>
        <div class="stat-card">
          <p class="stat-value">5</p>
          <p class="stat-label">Livraisons</p>
        </div>
        <div class="stat-card">
          <p class="stat-value">8</p>
          <p class="stat-label">Clients</p>
        </div>
      </section>

      <!-- TABLE -->
      <section class="card">
        <h2>Dernières commandes</h2>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 5" :key="n">
              <td>Boucherie Martin</td>
              <td>05/01/2026</td>
              <td>8</td>
              <td>42 kg</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style>
/* 🌑 Couleurs plus douces et fond moins blanc */
:root {
  --bg: #1f2937;           /* fond global gris foncé */
  --card: #111827;         /* fond des cartes */
  --primary: #3b82f6;      /* bleu vif */
  --primary-soft: #1e40af; /* bleu plus doux */
  --text: #f9fafb;         /* texte clair */
  --muted: #9ca3af;        /* texte secondaire */
  --border: #374151;       /* bordures */
  --success: #16a34a;
}

.app {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  background: var(--card);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

.sidebar h2 {
  margin-bottom: 2rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 1rem;
}

.sidebar a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
}

.sidebar a:hover {
  background: var(--primary-soft);
  color: white;
}

/* MAIN CONTENT */
.main {
  flex: 1;
  padding: 2rem;
}

/* TOP BAR */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--primary-soft);
}

/* STATS */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card);
  padding: 1.5rem;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
}

.stat-label {
  color: var(--muted);
  margin-top: 0.3rem;
}

/* CARD TABLE */
.card {
  background: var(--card);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.card h2 {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  color: var(--muted);
  font-weight: 500;
  padding-bottom: 0.6rem;
}

td {
  padding: 0.8rem 0;
  border-top: 1px solid var(--border);
}
</style>

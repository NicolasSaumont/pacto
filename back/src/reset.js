const { sequelize } = require('./config/db');

(async () => {
  try {
    console.log('🧹 Réinitialisation des tables...')
    await sequelize.sync({ force: true }); // Vide toutes les tables
    console.log('✅ Tables réinitialisées avec succès !');

    console.log('📦 Relance du seed...')
    require('./seed'); // Exécute le seed.js
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
})();

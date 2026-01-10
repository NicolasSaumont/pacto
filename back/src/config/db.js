const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres',
  logging: false,
});

async function connectWithRetry(retries = 15, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Connexion à PostgreSQL réussie.');
      return;
    } catch (err) {
      console.log(`⚠️ Postgres non prêt, tentative ${i + 1}/${retries} dans ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('❌ Impossible de se connecter à PostgreSQL après plusieurs tentatives.');
}

connectWithRetry();

module.exports = sequelize;

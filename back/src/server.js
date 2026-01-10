require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const sequelize = require('./config/db')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Exemple de route de base
app.get('/', (req, res) => {
  res.send('Backend opérationnel')
})

// Synchronise les modèles Sequelize avec la base de données
sequelize
  .sync({ force: false })
  .then(() =>
    console.log('Les modèles sont synchronisés avec la base de données.'),
  )

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})

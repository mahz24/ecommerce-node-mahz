const { db } = require('./utils/database');
const { app } = require('./app');
const dotenv = require('dotenv');
const { relations } = require('./models/relations');

dotenv.config({ path: './config.env' });

db.authenticate()
  .then(() => console.log('Server authenticated'))
  .catch(err => console.log(err));

//Entablish models relations
relations();

db.sync()
  .then(() => console.log('Server synced'))
  .catch(err => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running in port: ${PORT}`);
});

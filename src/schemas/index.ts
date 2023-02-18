import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import env from '../../config/env';

type DBConnection = {
  username: string;
  password: string;
  database: string;
  dialect: 'mariadb';
};

const basename = _basename(__filename);
const { dbData: config = {} } = env;
const { database, username, password, dialect } = config as DBConnection;
const db: any = {};

if (!database || !username || !password || !dialect) {
  throw new Error('Could not connect to DB');
}
const sequelize = new Sequelize(
  database,
  username,
  password,
  config as DBConnection
);

readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      ['.ts', '.js'].includes(file.slice(-3))
  )
  .forEach(async (file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    const modelName = require(join(__dirname, file));
    const model = modelName(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

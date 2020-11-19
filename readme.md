# Kottans-stats REST API

Backend for [**Kottans Statistics** SPA app](https://github.com/IgorKurkov/kottans-stats)

Written with **node.js**, **express**, **mongoDb**.

Deployed and live now on **HEROKU** and **MLAB**.

### commands to start locally

Start mongo: `mongod --dbpath C:/projects/mongodb-data/db` or `npm run mongo-local`

Start server: `npm run start`

dump db:
restore db from local by bson: `mongorestore --uri mongodb+srv://<dblogin>:<passwordOfDb>@<dbNameonCloud>.c6hyj.mongodb.net --db <dbNameonCloud> /dump/<dbnameonlocalhost>`

module.exports = {
  development: {
    client: 'sqlite3',
      connection: {
        filename: "./mydb.sqlite"
      },
      debug: true
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`
  }
};

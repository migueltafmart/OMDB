const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "db4free.net",
  user: "migueltafmart",
  password: "Hola1234$",
  connectionLimit: 5,
  database: "demosql",
});

exports.userId = async (email) => {
  let conn;
  let payload;
  try {
    conn = await pool.getConnection();
    let res = await conn.query("SELECT userID FROM users WHERE email=?", [email]);
    res = res
      .filter((a) => typeof a == "object")
      .map((object) => object.userID);
    payload = res[0];
  } catch (err) {
    console.log(err);
    payload = null;
  } finally {
    if (conn) conn.end();
    return payload;
  }
};

exports.users = async (email) => {
  let conn;
  let payload;
  let userId = await this.userId(email);
  try {
    conn = await pool.getConnection();
    res = await conn.query("SELECT * FROM users WHERE userID=?;", [userId]);
    res = res
      .filter((a) => typeof a == "object")
      .map((object) => object);
    console.log(res[0])
    payload = res[0];
  } catch (err) {
    console.log(err);
    payload = null;
  } finally {
    if (conn) conn.end();
    return payload;
  }
};
exports.postFavorite = async (email, datasource) => {
  let conn;
  let payload;
  let userId = await this.userId(email);
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "INSERT INTO favorites (userID, datasource) VALUES (?,?);",
      [userId, datasource]
    );
    res = res
      .filter((a) => typeof a == "object")
      .map((object) => object.datasource);
    payload = res;
  } catch (err) {
    console.log(err);
    payload = null;
  } finally {
    if (conn) conn.end();
    return payload;
  }
};
exports.deleteFavorite = async (email, datasource) => {
  let conn;
  let payload;
  let userId = await this.userId(email);
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "DELETE FROM favorites WHERE userID=? AND datasource=? ;",
      [userId, datasource]
    );
    res = res
      .filter((a) => typeof a == "object")
      .map((object) => object.datasource);
    payload = res;
  } catch (err) {
    console.log(err);
    payload = null;
  } finally {
    if (conn) conn.end();
    return payload;
  }
};
exports.favorites = async (email) => {
  let conn;
  let payload;
  let userId = await this.userId(email);
  try {
    conn = await pool.getConnection();
    res = await conn.query("SELECT datasource FROM favorites WHERE userID=?;", [
      userId,
    ]);
    res = res
      .filter((a) => typeof a == "object")
      .map((object) => object.datasource);
    payload = res;
  } catch (err) {
    payload = null;
  } finally {
    if (conn) conn.end();
    return payload;
  }
};

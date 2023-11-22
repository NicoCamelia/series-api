const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "carbo",
  database: "seriesdb",
  connectionLimit: 5,
});

const getSeries = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT id, name, calification FROM series");
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

const getSeriesById = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id, name, calification FROM series WHERE id=?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

const addSeries = async (serie) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO series(name, calification) VALUES(?, ?)`,
      [serie.name, serie.calification]
    );
    return { id: parseInt(response.insertId), ...serie };
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

const deleteSerie = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM series WHERE id=?", [id]);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getSeries,
  getSeriesById,
  addSeries,
  deleteSerie,
};

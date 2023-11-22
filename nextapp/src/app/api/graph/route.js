import mysql from 'mysql2'


export async function GET(request) {


  const pool = await mysql.createPool({host: 'localhost', user: 'root', password: 'browsingdata', database: 'browsing'}).promise();

  const res = await pool.query('SELECT * FROM users');
  console.log(res);
  await pool.end();
  return Response.json({res});
}

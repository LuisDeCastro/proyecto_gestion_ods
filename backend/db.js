import sql from "mssql";

const config = {
  user: "luis",          // Cámbialo por tu usuario
  password: "123456",    // Cámbialo por tu contraseña
  server: "localhost",     
  database: "gestion_ods_salud",
  options: {
    encrypt: false,       
    trustServerCertificate: true
  }
};

export async function getPool() {
  const pool = await sql.connect(config);
  return pool;
}

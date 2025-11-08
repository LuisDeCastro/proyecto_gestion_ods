import express from "express";
import sql from "mssql";
import { getPool } from "../db.js";

const router = express.Router();

// Obtener todos los indicadores
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM indicador_salud");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener indicadores:", err);
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo indicador
router.post("/", async (req, res) => {
  try {
    const { codigo_indicador, nombre_indicador, unidad_medida, valor, anio, descripcion } = req.body;

    const pool = await getPool();
    await pool.request()
      .input("codigo_indicador", codigo_indicador)
      .input("nombre_indicador", nombre_indicador)
      .input("unidad_medida", unidad_medida)
      .input('valor', sql.Decimal(10,2), valor)
      .input('anio', sql.Int, anio)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`
        INSERT INTO indicador_salud (codigo_indicador, nombre_indicador, unidad_medida, valor, anio, descripcion)
        VALUES (@codigo_indicador, @nombre_indicador, @unidad_medida, @valor, @anio, @descripcion)
      `);


    res.json({ message: "Indicador agregado correctamente" });
  } catch (err) {
    console.error("Error al insertar indicador:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un indicador
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_indicador, nombre_indicador, unidad_medida, valor, anio, descripcion } = req.body;

    const pool = await getPool();
    await pool.request()
      .input("id", id)
      .input("codigo_indicador", codigo_indicador)
      .input("nombre_indicador", nombre_indicador)
      .input("unidad_medida", unidad_medida)
      .input('valor', sql.Decimal(10,2), valor)
      .input('anio', sql.Int, anio)
      .input('descripcion', sql.VarChar, descripcion)
      .query(`
        UPDATE indicador_salud
        SET codigo_indicador = @codigo_indicador,
            nombre_indicador = @nombre_indicador,
            unidad_medida = @unidad_medida,
            valor = @valor,
            anio = @anio,
            descripcion = @descripcion
        WHERE id_indicador = @id
      `);

    res.json({ message: "Indicador actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un indicador
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id", req.params.id)
      .query("DELETE FROM indicador_salud WHERE id_indicador = @id");
    res.json({ message: "Indicador eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

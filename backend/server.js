import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import indicadoresRoutes from "./routes/indicadores.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/indicadores", indicadoresRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir React build
app.use(express.static(path.join(__dirname, "build")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
  
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

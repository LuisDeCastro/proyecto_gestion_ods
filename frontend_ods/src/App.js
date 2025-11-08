import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [indicadores, setIndicadores] = useState([]);
  const [form, setForm] = useState({
    codigo_indicador: "",
    nombre_indicador: "",
    unidad_medida: "",
    valor: "",
    anio: "",
    descripcion: "",
  });
  const [editId, setEditId] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchIndicadores();
  }, []);

  const fetchIndicadores = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/indicadores");
      const data = await res.json();
      setIndicadores(data);
    } catch (err) {
      console.error("Error al obtener indicadores:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const metodo = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:5000/api/indicadores/${editId}`
        : "http://localhost:5000/api/indicadores";

      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({
        codigo_indicador: "",
        nombre_indicador: "",
        unidad_medida: "",
        valor: "",
        anio: "",
        descripcion: "",
      });
      setEditId(null);
      fetchIndicadores();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleEdit = (ind) => {
    setForm({
      codigo_indicador: ind.codigo_indicador,
      nombre_indicador: ind.nombre_indicador,
      unidad_medida: ind.unidad_medida,
      valor: ind.valor,
      anio: ind.anio,
      descripcion: ind.descripcion,
    });
    setEditId(ind.id_indicador);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este indicador?")) {
      await fetch(`http://localhost:5000/api/indicadores/${id}`, {
        method: "DELETE",
      });
      fetchIndicadores();
    }
  };

  // Preparar datos para el gráfico de línea (evolución por año)
  const anios = [...new Set(indicadores.map((i) => i.anio))].sort();
  const promedioPorAnio = anios.map((a) => {
    const delAnio = indicadores.filter((i) => i.anio === a);
    const suma = delAnio.reduce((acc, cur) => acc + Number(cur.valor || 0), 0);
    return delAnio.length ? suma / delAnio.length : 0;
  });

  // Preparar unidades únicas para el gráfico de pastel
  const unidades = [...new Set(indicadores.map((i) => i.unidad_medida || "Sin unidad"))];

  // Datos para el gráfico de pastel
  const totalIndicadores = indicadores.length;
  const conteoPorUnidadPie = unidades.map(
    (u) => indicadores.filter((i) => i.unidad_medida === u).length
  );
  const porcentajePorUnidad = conteoPorUnidadPie.map(
    (c) => ((c / totalIndicadores) * 100).toFixed(2)
  );

  const dataPie = {
    labels: unidades,
    datasets: [
      {
        label: "Proporción por Unidad",
        data: porcentajePorUnidad,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Proporción de Indicadores por Unidad de Medida" },
    },
  };

  const data = {
    labels: anios,
    datasets: [
      {
        label: "Promedio de indicadores de salud (valor)",
        data: promedioPorAnio,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Evolución de los Indicadores de Salud por Año (ODS 3)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Valor promedio" },
      },
      x: {
        title: { display: true, text: "Año" },
      },
    },
  };

  return (
    <div className="App">
      <h1>Indicadores de Salud - ODS 3</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="formulario">
        <input
          type="text"
          name="codigo_indicador"
          placeholder="Código"
          value={form.codigo_indicador}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre_indicador"
          placeholder="Nombre"
          value={form.nombre_indicador}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unidad_medida"
          placeholder="Unidad de Medida"
          value={form.unidad_medida}
          onChange={handleChange}
        />
        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={form.valor}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="anio"
          placeholder="Año"
          value={form.anio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
        {editId && (
          <button
            type="button"
            className="cancelar"
            onClick={() => {
              setForm({
                codigo_indicador: "",
                nombre_indicador: "",
                unidad_medida: "",
                valor: "",
                anio: "",
                descripcion: "",
              });
              setEditId(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Valor</th>
            <th>Año</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {indicadores.map((ind) => (
            <tr key={ind.id_indicador}>
              <td>{ind.codigo_indicador}</td>
              <td>{ind.nombre_indicador}</td>
              <td>{ind.unidad_medida}</td>
              <td>{ind.valor}</td>
              <td>{ind.anio}</td>
              <td>{ind.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(ind)}>✏️</button>
                <button onClick={() => handleDelete(ind.id_indicador)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráficos */}
      {indicadores.length > 0 ? (
        <div style={{ width: "700px", margin: "40px auto" }}>
          <Line data={data} options={options} />
          <Pie data={dataPie} options={optionsPie} />
        </div>
      ) : (
        <p>No hay datos suficientes para mostrar el gráfico</p>
      )}
    </div>
  );
}

export default App;

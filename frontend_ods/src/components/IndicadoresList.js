import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IndicadoresList = () => {
  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    fetchIndicadores();
  }, []);

  const fetchIndicadores = async () => {
    const response = await axios.get("http://localhost:5000/api/indicadores");
    setIndicadores(response.data);
  };

  const deleteIndicador = async (id) => {
    await axios.delete(`http://localhost:5000/api/indicadores/${id}`);
    fetchIndicadores();
  };

  return (
    <div>
      <Link to="/add">Agregar Indicador</Link>
      <ul>
        {indicadores.map((ind) => (
          <li key={ind.id_indicador}>
            {ind.nombre_indicador} ({ind.codigo_indicador})
            <Link to={`/edit/${ind.id_indicador}`}>Editar</Link>
            <button onClick={() => deleteIndicador(ind.id_indicador)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndicadoresList;
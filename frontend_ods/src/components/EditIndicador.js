import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditIndicador = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    id_meta: '',
    codigo_indicador: '',
    nombre_indicador: '',
    unidad_medida: '',
    descripcion: ''
  });
  const [metas, setMetas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndicador = async () => {
      const response = await axios.get(`http://localhost:3001/api/indicadores`);
      const indicador = response.data.find(ind => ind.id_indicador == id);
      setForm(indicador);
    };
    const fetchMetas = async () => {
      const response = await axios.get('http://localhost:3001/api/metas');
      setMetas(response.data);
    };
    fetchIndicador();
    fetchMetas();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/indicadores/${id}`, form);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="id_meta" value={form.id_meta} onChange={handleChange} required>
        {metas.map((meta) => (
          <option key={meta.id_meta} value={meta.id_meta}>{meta.codigo_meta}</option>
        ))}
      </select>
      <input name="codigo_indicador" value={form.codigo_indicador} onChange={handleChange} required />
      <input name="nombre_indicador" value={form.nombre_indicador} onChange={handleChange} required />
      <input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} required />
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
      <button type="submit">Actualizar</button>
    </form>
  );
};

export default EditIndicador;
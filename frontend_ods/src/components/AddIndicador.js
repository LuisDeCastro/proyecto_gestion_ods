import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddIndicador = () => {
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
    const fetchMetas = async () => {
      const response = await axios.get('http://localhost:5000/api/metas');
      setMetas(response.data);
    };
    fetchMetas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/indicadores', form);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="id_meta" onChange={handleChange} required>
        <option value="">Seleccionar Meta</option>
        {metas.map((meta) => (
          <option key={meta.id_meta} value={meta.id_meta}>{meta.codigo_meta}</option>
        ))}
      </select>
      <input name="codigo_indicador" placeholder="Código Indicador" onChange={handleChange} required />
      <input name="nombre_indicador" placeholder="Nombre Indicador" onChange={handleChange} required />
      <input name="unidad_medida" placeholder="Unidad de Medida" onChange={handleChange} required />
      <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
      <button type="submit">Crear</button>
    </form>
  );
};

export default AddIndicador;
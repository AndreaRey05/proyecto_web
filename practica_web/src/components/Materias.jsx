import { useState, useEffect } from 'react';
import API_URL, { getHeaders } from '../config';  // ← usa tu archivo config.js

// Datos de ejemplo para mostrar mientras conectas la API
const MOCK_MATERIAS = [
  { id_materia: 1, nombre: 'Matemáticas I', semestre: 1 },
  { id_materia: 2, nombre: 'Física I', semestre: 1 },
  { id_materia: 3, nombre: 'Programación Web', semestre: 3 },
  { id_materia: 4, nombre: 'Bases de Datos', semestre: 4 },
];

function Materias({ rol }) {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  const [contrasena, setContrasena] = useState('');
  const [errorContra, setErrorContra] = useState('');
  const [profesoresMateria, setProfesoresMateria] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevaMateria, setNuevaMateria] = useState({ nombre: '', semestre: '' });
  const [errorAgregar, setErrorAgregar] = useState('');

  const token = localStorage.getItem('token');

  // Cargar materias desde la API (con fallback a datos de ejemplo)
  useEffect(() => {
    setCargando(true);
    setError(null);

    fetch(`${API_URL}/api/materias`, { headers: getHeaders(token) })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        const materiasData = Array.isArray(data) ? data : [];
        setMaterias(materiasData);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error cargando materias:', err);
        // Fallback: usar datos de ejemplo para que la pantalla no quede en blanco
        setMaterias(MOCK_MATERIAS);
        setError('No se pudo conectar con el servidor. Mostrando datos de ejemplo.');
        setCargando(false);
      });
  }, [token]);

  // Cargar profesores de la materia seleccionada (opcional)
  useEffect(() => {
    if (seleccionada && seleccionada.id_materia) {
      fetch(`${API_URL}/api/materias/${seleccionada.id_materia}/profesores`, {
        headers: getHeaders(token)
      })
        .then(r => r.json())
        .then(data => setProfesoresMateria(Array.isArray(data) ? data : []))
        .catch(() => setProfesoresMateria([]));
    }
  }, [seleccionada, token]);

  const colores = [
    'bg-yellow-100', 'bg-blue-100', 'bg-purple-100',
    'bg-green-100', 'bg-red-100', 'bg-pink-100',
    'bg-orange-100', 'bg-teal-100', 'bg-indigo-100'
  ];

  const filtradas = materias.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminar = (id_materia) => {
    setModalEliminar(id_materia);
    setContrasena('');
    setErrorContra('');
  };

  const confirmarEliminar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/materias/${modalEliminar}`, {
        method: 'DELETE',
        headers: getHeaders(token, true),
        body: JSON.stringify({ contrasena })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorContra(data.error || 'Error al eliminar');
        return;
      }
      setMaterias(prev => prev.filter(m => m.id_materia !== modalEliminar));
      if (seleccionada?.id_materia === modalEliminar) setSeleccionada(null);
      setModalEliminar(null);
    } catch (err) {
      setErrorContra('Error de conexión');
    }
  };

  const handleAgregar = async () => {
    if (!nuevaMateria.nombre.trim() || !nuevaMateria.semestre) {
      setErrorAgregar('Nombre y semestre son obligatorios');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/materias`, {
        method: 'POST',
        headers: getHeaders(token, true),
        body: JSON.stringify({
          nombre: nuevaMateria.nombre,
          semestre: parseInt(nuevaMateria.semestre)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorAgregar(data.error || 'Error al crear');
        return;
      }
      setMaterias(prev => [...prev, data]);
      setModalAgregar(false);
      setNuevaMateria({ nombre: '', semestre: '' });
      setErrorAgregar('');
    } catch (err) {
      setErrorAgregar('Error de conexión');
    }
  };

  if (cargando) {
    return <div className="p-6 text-center text-gray-500">Cargando materias...</div>;
  }

  return (
    <div className="flex gap-4 p-6 h-full">
      {error && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow text-sm z-50">
          ⚠️ {error}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar materia..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>
          {rol === 'administrador' && (
            <button
              onClick={() => setModalAgregar(true)}
              className="bg-[#5E0006] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#7a0008] transition shadow"
            >
              + Agregar materia
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-4 overflow-auto">
          {filtradas.length === 0 && (
            <p className="text-gray-400 text-sm col-span-5 text-center py-8">
              No hay materias registradas
            </p>
          )}
          {filtradas.map((m, i) => (
            <div
              key={m.id_materia}
              onClick={() => setSeleccionada(m)}
              className={`${colores[i % colores.length]} rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition relative`}
            >
              {rol === 'administrador' && (
                <button
                  onClick={e => { e.stopPropagation(); handleEliminar(m.id_materia); }}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
              <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center text-3xl">📚</div>
              <p className="text-xs font-bold text-gray-700 text-center truncate w-full">{m.nombre}</p>
              <p className="text-xs text-gray-500">Semestre: {m.semestre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal detalle */}
      {seleccionada && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
            <button onClick={() => setSeleccionada(null)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">📖</div>
              <p className="font-bold text-gray-800 text-lg">{seleccionada.nombre}</p>
            </div>
            <div className="w-full text-sm flex flex-col gap-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-400">Semestre</span>
                <span className="font-medium text-gray-700">{seleccionada.semestre}</span>
              </div>
              <div className="flex flex-col gap-1 border-b pb-2">
                <span className="text-gray-400 mb-1">Profesores que la imparten</span>
                <div className="flex flex-wrap gap-1">
                  {profesoresMateria.map((p, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">{p.nombre}</span>
                  ))}
                  {profesoresMateria.length === 0 && <span className="text-gray-400 text-xs">Sin profesores asignados</span>}
                </div>
              </div>
            </div>
            {rol === 'administrador' && (
              <button onClick={() => handleEliminar(seleccionada.id_materia)} className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition w-full">
                Eliminar materia
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
            <button onClick={() => setModalEliminar(null)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
            <h2 className="font-bold text-lg text-[#5E0006]">Confirmar eliminación</h2>
            <p className="text-sm text-gray-500">Ingresa tu contraseña para confirmar</p>
            <input type="password" placeholder="Contraseña" value={contrasena} onChange={e => { setContrasena(e.target.value); setErrorContra(''); }} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errorContra && <p className="text-red-500 text-xs">{errorContra}</p>}
            <button onClick={confirmarEliminar} className="bg-red-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition">Eliminar</button>
          </div>
        </div>
      )}

      {/* Modal agregar */}
      {modalAgregar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative flex flex-col gap-4">
            <button onClick={() => { setModalAgregar(false); setErrorAgregar(''); setNuevaMateria({ nombre: '', semestre: '' }); }} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
            <h2 className="font-bold text-lg text-[#5E0006]">Agregar nueva materia</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Nombre de la materia</label>
              <input type="text" placeholder="Ej: Matemáticas I" value={nuevaMateria.nombre} onChange={e => setNuevaMateria({ ...nuevaMateria, nombre: e.target.value })} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5E0006]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Semestre (número)</label>
              <input type="number" placeholder="Ej: 1, 2, 3..." value={nuevaMateria.semestre} onChange={e => setNuevaMateria({ ...nuevaMateria, semestre: e.target.value })} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5E0006]" />
            </div>
            {errorAgregar && <p className="text-red-500 text-xs">{errorAgregar}</p>}
            <button onClick={handleAgregar} className="bg-[#5E0006] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#7a0008] transition">Guardar materia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materias;
import { useState, useEffect } from 'react'
import API_URL, { getHeaders } from '../config'

function Grupos({ rol }) {
    const [grupos, setGrupos] = useState([])
    const [profesores, setProfesores] = useState([])
    const [enCurso, setEnCurso] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [seleccionado, setSeleccionado] = useState(null)
    const [modalCrear, setModalCrear] = useState(false)
    const [modalEditar, setModalEditar] = useState(null)
    const [modalEliminar, setModalEliminar] = useState(null)
    const [modalTutor, setModalTutor] = useState(null)
    const [contrasena, setContrasena] = useState('')
    const [errorContra, setErrorContra] = useState('')
    const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', semestre: '' })
    const [tutorSeleccionado, setTutorSeleccionado] = useState('')

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (rol === 'administrador') {
            fetch(`${API_URL}/api/grupos`, { headers: getHeaders(token) })
                .then(r => r.json()).then(d => setGrupos(Array.isArray(d) ? d : []))
            fetch(`${API_URL}/api/profesores`, { headers: getHeaders(token) })
                .then(r => r.json()).then(d => setProfesores(Array.isArray(d) ? d : []))
        } else {
            fetch(`${API_URL}/api/grupos/en-curso`, { headers: getHeaders(token) })
                .then(r => r.json()).then(d => setEnCurso(Array.isArray(d) ? d : []))
        }
    }, [rol])

    const colores = [
        'bg-yellow-100', 'bg-blue-100', 'bg-purple-100',
        'bg-green-100', 'bg-red-100', 'bg-pink-100',
        'bg-orange-100', 'bg-teal-100', 'bg-indigo-100'
    ]

    const filtrados = grupos.filter(g =>
        g.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    const handleCrear = async () => {
        const res = await fetch(`${API_URL}/api/grupos`, {
            method: 'POST',
            headers: getHeaders(token, true),
            body: JSON.stringify(nuevoGrupo)
        })
        const data = await res.json()
        if (!res.ok) return
        setGrupos(prev => [...prev, data])
        setModalCrear(false)
        setNuevoGrupo({ nombre: '', semestre: '' })
    }

    const handleEditar = async () => {
        const res = await fetch(`${API_URL}/api/grupos/${modalEditar.id_grupo}`, {
            method: 'PUT',
            headers: getHeaders(token, true),
            body: JSON.stringify({ nombre: modalEditar.nombre, semestre: modalEditar.semestre })
        })
        if (!res.ok) return
        setGrupos(prev => prev.map(g => g.id_grupo === modalEditar.id_grupo ? { ...g, ...modalEditar } : g))
        setModalEditar(null)
    }

    const handleAsignarTutor = async () => {
        const res = await fetch(`${API_URL}/api/grupos/${modalTutor.id_grupo}/tutor`, {
            method: 'PUT',
            headers: getHeaders(token, true),
            body: JSON.stringify({ num_cuenta_profesor: tutorSeleccionado || null })
        })
        if (!res.ok) return
        setGrupos(prev => prev.map(g =>
            g.id_grupo === modalTutor.id_grupo
                ? { ...g, nombre_tutor: profesores.find(p => p.num_cuenta == tutorSeleccionado)?.nombre || null }
                : g
        ))
        setModalTutor(null)
    }

    const confirmarEliminar = async () => {
        const res = await fetch(`${API_URL}/api/grupos/${modalEliminar}`, {
            method: 'DELETE',
            headers: getHeaders(token, true),
            body: JSON.stringify({ contrasena })
        })
        const data = await res.json()
        if (!res.ok) { setErrorContra(data.error); return }
        setGrupos(prev => prev.filter(g => g.id_grupo !== modalEliminar))
        if (seleccionado?.id_grupo === modalEliminar) setSeleccionado(null)
        setModalEliminar(null)
    }

    // Vista para profesores y alumnos: clases en curso
    if (rol !== 'administrador') {
        return (
            <div className="p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-gray-700">Clases en curso ahora</h2>
                {enCurso.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-12">No hay clases en curso en este momento</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {enCurso.map((c, i) => (
                            <div key={c.id_clase} className={`${colores[i % colores.length]} rounded-2xl p-4 flex flex-col gap-2`}>
                                <p className="font-bold text-gray-800">{c.materia}</p>
                                <p className="text-xs text-gray-500">Grupo: {c.grupo}</p>
                                <p className="text-xs text-gray-500">Salón: {c.salon}</p>
                                <p className="text-xs text-gray-500">Profesor: {c.profesor}</p>
                                <p className="text-xs text-gray-400">{c.hora_inicio} - {c.hora_fin}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // Vista admin: CRUD de grupos
    return (
        <div className="flex gap-4 p-6 h-full">
            <div className="flex-1 flex flex-col gap-4">

                {/* Barra búsqueda + botón crear */}
                <div className="flex gap-3 items-center">
                    <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar grupo"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="outline-none text-sm flex-1 bg-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setModalCrear(true)}
                        className="bg-[#5E0006] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-800 transition"
                    >
                        + Nuevo Grupo
                    </button>
                </div>

                {/* Grid de tarjetas */}
                <div className="grid grid-cols-5 gap-4 overflow-auto">
                    {filtrados.length === 0 && (
                        <p className="text-gray-400 text-sm col-span-5 text-center py-8">No hay grupos registrados</p>
                    )}
                    {filtrados.map((g, i) => (
                        <div
                            key={g.id_grupo}
                            onClick={() => setSeleccionado(g)}
                            className={`${colores[i % colores.length]} rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition relative`}
                        >
                            <button
                                onClick={e => { e.stopPropagation(); setModalEliminar(g.id_grupo); setContrasena(''); setErrorContra('') }}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs font-bold"
                            >✕</button>
                            <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center text-3xl">
                                🎓
                            </div>
                            <p className="text-xs font-bold text-gray-700 text-center truncate w-full">{g.nombre}</p>
                            <p className="text-xs text-gray-400">Semestre {g.semestre}</p>
                            {g.nombre_tutor && (
                                <p className="text-xs text-green-600 text-center">Tutor: {g.nombre_tutor}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal detalle grupo */}
            {seleccionado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col items-center gap-3">
                        <button onClick={() => setSeleccionado(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">🎓</div>
                        <p className="font-bold text-gray-800 text-lg">{seleccionado.nombre}</p>
                        <p className="text-sm text-gray-400">Semestre {seleccionado.semestre}</p>
                        <p className="text-sm text-gray-500">
                            Tutor: <span className="font-medium">{seleccionado.nombre_tutor || 'Sin tutor'}</span>
                        </p>
                        <div className="flex flex-col gap-2 w-full mt-2">
                            <button
                                onClick={() => { setModalEditar({ ...seleccionado }); setSeleccionado(null) }}
                                className="bg-blue-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition w-full"
                            >Editar grupo</button>
                            <button
                                onClick={() => { setModalTutor(seleccionado); setTutorSeleccionado(''); setSeleccionado(null) }}
                                className="bg-green-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition w-full"
                            >Asignar tutor</button>
                            <button
                                onClick={() => { setSeleccionado(null); setModalEliminar(seleccionado.id_grupo); setContrasena(''); setErrorContra('') }}
                                className="bg-red-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition w-full"
                            >Eliminar grupo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal crear */}
            {modalCrear && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
                        <button onClick={() => setModalCrear(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <h2 className="font-bold text-lg text-[#5E0006]">Nuevo Grupo</h2>
                        <input
                            type="text" placeholder="Nombre (ej: 6A)"
                            value={nuevoGrupo.nombre}
                            onChange={e => setNuevoGrupo(p => ({ ...p, nombre: e.target.value }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            type="number" placeholder="Semestre"
                            value={nuevoGrupo.semestre}
                            onChange={e => setNuevoGrupo(p => ({ ...p, semestre: e.target.value }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <button onClick={handleCrear}
                            className="bg-[#5E0006] text-white py-2 rounded-lg font-bold text-sm hover:bg-red-800 transition">
                            Crear
                        </button>
                    </div>
                </div>
            )}

            {/* Modal editar */}
            {modalEditar && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
                        <button onClick={() => setModalEditar(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <h2 className="font-bold text-lg text-[#5E0006]">Editar Grupo</h2>
                        <input
                            type="text" placeholder="Nombre"
                            value={modalEditar.nombre}
                            onChange={e => setModalEditar(p => ({ ...p, nombre: e.target.value }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            type="number" placeholder="Semestre"
                            value={modalEditar.semestre}
                            onChange={e => setModalEditar(p => ({ ...p, semestre: e.target.value }))}
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <button onClick={handleEditar}
                            className="bg-blue-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition">
                            Guardar cambios
                        </button>
                    </div>
                </div>
            )}

            {/* Modal asignar tutor */}
            {modalTutor && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
                        <button onClick={() => setModalTutor(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <h2 className="font-bold text-lg text-[#5E0006]">Asignar Tutor — {modalTutor.nombre}</h2>
                        <select
                            value={tutorSeleccionado}
                            onChange={e => setTutorSeleccionado(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">Sin tutor</option>
                            {profesores.map(p => (
                                <option key={p.num_cuenta} value={p.num_cuenta}>{p.nombre}</option>
                            ))}
                        </select>
                        <button onClick={handleAsignarTutor}
                            className="bg-green-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition">
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {modalEliminar && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
                        <button onClick={() => setModalEliminar(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <h2 className="font-bold text-lg text-[#5E0006]">Confirmar eliminación</h2>
                        <p className="text-sm text-gray-500">Ingresa tu contraseña para confirmar</p>
                        <input
                            type="password" placeholder="Contraseña"
                            value={contrasena}
                            onChange={e => { setContrasena(e.target.value); setErrorContra('') }}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                        {errorContra && <p className="text-red-500 text-xs">{errorContra}</p>}
                        <button onClick={confirmarEliminar}
                            className="bg-red-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition">
                            Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Grupos
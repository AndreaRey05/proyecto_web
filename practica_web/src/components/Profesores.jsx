import { useState, useEffect } from 'react'
import API_URL from '../config'

function Profesores({ rol }) {
    const [profesores, setProfesores] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [seleccionado, setSeleccionado] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${API_URL}/api/profesores`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setProfesores(Array.isArray(data) ? data : []))
            .catch(() => setProfesores([]))
    }, [])

    const colores = [
        'bg-yellow-100', 'bg-blue-100', 'bg-purple-100',
        'bg-green-100', 'bg-red-100', 'bg-pink-100',
        'bg-orange-100', 'bg-teal-100', 'bg-indigo-100'
    ]

    const filtrados = profesores.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    const [modalEliminar, setModalEliminar] = useState(null) // guarda el num_cuenta a eliminar
    const [contrasena, setContrasena] = useState('')
    const [errorContra, setErrorContra] = useState('')

    const handleEliminar = (num_cuenta) => {
        setModalEliminar(num_cuenta)
        setContrasena('')
        setErrorContra('')
    }

    const confirmarEliminar = async () => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_URL}/api/profesores/${modalEliminar}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contrasena })
        })
        const data = await res.json()
        if (!res.ok) {
            setErrorContra(data.error)
            return
        }
        setProfesores(prev => prev.filter(p => p.num_cuenta !== modalEliminar))
        if (seleccionado?.num_cuenta === modalEliminar) setSeleccionado(null)
        setModalEliminar(null)

        {
            modalEliminar && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col gap-4">
                        <button onClick={() => setModalEliminar(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                        <h2 className="font-bold text-lg text-[#5E0006]">Confirmar eliminación</h2>
                        <p className="text-sm text-gray-500">Ingresa tu contraseña para confirmar</p>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={e => { setContrasena(e.target.value); setErrorContra('') }}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                        {errorContra && (
                            <p className="text-red-500 text-xs">{errorContra}</p>
                        )}
                        <button
                            onClick={confirmarEliminar}
                            className="bg-red-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="flex gap-4 p-6 h-full">
            <div className="flex-1 flex flex-col gap-4">

                {/* Barra búsqueda */}
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Encuentra al Profesor"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="outline-none text-sm flex-1 bg-transparent"
                    />
                </div>

                {/* Grid de tarjetas */}
                <div className="grid grid-cols-5 gap-4 overflow-auto">
                    {filtrados.length === 0 && (
                        <p className="text-gray-400 text-sm col-span-5 text-center py-8">
                            No hay profesores registrados
                        </p>
                    )}
                    {filtrados.map((p, i) => (
                        <div
                            key={p.num_cuenta}
                            onClick={() => setSeleccionado(p)}
                            className={`${colores[i % colores.length]} rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition relative`}
                        >
                            {/* Botón eliminar — solo admin */}
                            {rol === 'administrador' && (
                                <button
                                    onClick={e => { e.stopPropagation(); handleEliminar(p.num_cuenta) }}
                                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            )}

                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center text-3xl">
                                👤
                            </div>
                            <p className="text-xs font-bold text-gray-700 text-center truncate w-full text-center">
                                {p.nombre}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal detalle profesor */}
            {seleccionado && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative flex flex-col items-center gap-3">
                        <button
                            onClick={() => setSeleccionado(null)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
                        >✕</button>

                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
                            👤
                        </div>

                        <p className="font-bold text-gray-800 text-lg">{seleccionado.nombre}</p>
                        <p className="text-xs text-gray-400">Núm. cuenta: {seleccionado.num_cuenta}</p>

                        <div className="w-full text-sm flex flex-col gap-2 mt-2">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-400">Turno</span>
                                <span className="font-medium">
                                    {seleccionado.hora_entrada} - {seleccionado.hora_salida}
                                </span>
                            </div>
                        </div>

                        {rol === 'administrador' && (
                            <button
                                onClick={() => handleEliminar(seleccionado.num_cuenta)}
                                className="mt-2 bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition w-full"
                            >
                                Eliminar Profesor
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profesores
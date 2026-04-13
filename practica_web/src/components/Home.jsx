import { useState, useEffect } from 'react'
import API_URL from '../config'


// Calendario pequeño
function Calendario() {
    const hoy = new Date()
    const [mes, setMes] = useState(hoy.getMonth())
    const [anio, setAnio] = useState(hoy.getFullYear())

    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

    const primerDia = new Date(anio, mes, 1).getDay()
    const diasEnMes = new Date(anio, mes + 1, 0).getDate()

    const anterior = () => {
        if (mes === 0) { setMes(11); setAnio(a => a - 1) }
        else setMes(m => m - 1)
    }
    const siguiente = () => {
        if (mes === 11) { setMes(0); setAnio(a => a + 1) }
        else setMes(m => m + 1)
    }

    const celdas = []
    for (let i = 0; i < primerDia; i++) celdas.push(null)
    for (let i = 1; i <= diasEnMes; i++) celdas.push(i)

    return (
        <div className="bg-white rounded-2xl shadow p-4 w-72">
            <p className="font-bold text-lg mb-2">{meses[mes]}, {anio}</p>
            <div className="flex items-center justify-between mb-2">
                <button onClick={anterior} className="text-gray-500 hover:text-[#5E0006]">‹</button>
                <div className="flex gap-2">
                    <select value={mes} onChange={e => setMes(parseInt(e.target.value))}
                        className="text-sm border rounded px-1">
                        {meses.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select value={anio} onChange={e => setAnio(parseInt(e.target.value))}
                        className="text-sm border rounded px-1">
                        {[2024,2025,2026,2027].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <button onClick={siguiente} className="text-gray-500 hover:text-[#5E0006]">›</button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-1">
                {celdas.map((dia, i) => (
                    <span key={i} className={`py-1 rounded-full
                        ${dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
                            ? 'bg-[#5E0006] text-white font-bold' : 'text-gray-700'}`}>
                        {dia || ''}
                    </span>
                ))}
            </div>
        </div>
    )
}

// Modal de detalle de salón
function ModalSalon({ clase, onClose }) {
    if (!clase) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[480px] relative">
                <button onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="text-center font-bold text-lg text-[#5E0006] mb-4 bg-red-50 py-2 rounded-lg">
                    {clase.salon}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Profesor asignado</p>
                        <p className="font-semibold">{clase.profesor}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Próxima clase</p>
                        <p className="font-semibold">{clase.hora_inicio} - {clase.hora_fin}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Horario</p>
                        <p className="font-semibold">{clase.hora_entrada} - {clase.hora_salida}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Materia</p>
                        <p className="font-semibold">{clase.materia}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Grupo en clase</p>
                        <p className="font-semibold">{clase.grupo}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">Capacidad</p>
                        <p className="font-semibold">{clase.capacidad}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Home({ rol }) {
    const [clases, setClases] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [seleccionado, setSeleccionado] = useState(null)
    const [modalClase, setModalClase] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${API_URL}/api/horario`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setClases(Array.isArray(data) ? data : []))
        .catch(() => setClases([]))
    }, [])

    // Agrupar por salón — mostrar si está ocupado ahora
    const ahora = new Date()
    const diaActual = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][ahora.getDay()]
    const horaActual = ahora.toTimeString().slice(0, 5)

    const salonesUnicos = [...new Map(clases.map(c => [c.salon, c])).values()]

    const estaOcupado = (salon) => {
        return clases.some(c =>
            c.salon === salon &&
            c.dia === diaActual &&
            horaActual >= c.hora_inicio.slice(0,5) &&
            horaActual <= c.hora_fin.slice(0,5)
        )
    }

    const claseActual = (salon) => {
        return clases.find(c =>
            c.salon === salon &&
            c.dia === diaActual &&
            horaActual >= c.hora_inicio.slice(0,5) &&
            horaActual <= c.hora_fin.slice(0,5)
        )
    }

    const filtrados = salonesUnicos.filter(c =>
        c.salon.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.profesor.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="flex gap-4 p-6 h-full">

            {/* Centro */}
            <div className="flex-1 flex flex-col gap-4">

                {/* Barra de búsqueda */}
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Encuentra tu aula"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="outline-none text-sm flex-1 bg-transparent"
                    />
                </div>

                {/* Encabezado */}
                <div className="bg-white rounded-2xl shadow p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-700">Administración de Aulas</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Consulta la disponibilidad de aulas y salones en tiempo real.
                    </p>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow p-4 flex-1 overflow-auto">
                    <p className="font-bold text-gray-600 mb-3">Profesor</p>
                    <div className="flex flex-col gap-2">
                        {filtrados.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-8">
                                No hay aulas registradas aún
                            </p>
                        )}
                        {filtrados.map((c, i) => {
                            const ocupado = estaOcupado(c.salon)
                            const claseAhora = claseActual(c.salon)
                            return (
                                <div key={i}
                                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition">
                                    {/* Profesor */}
                                    <div className="flex items-center gap-3 w-48">
                                        <div className="w-9 h-9 rounded-full bg-[#5E0006] flex items-center justify-center text-white text-sm font-bold">
                                            {c.profesor.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium truncate">{c.profesor}</span>
                                    </div>

                                    {/* Salón */}
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                                        ${i % 4 === 0 ? 'bg-pink-100 text-pink-700' :
                                          i % 4 === 1 ? 'bg-yellow-100 text-yellow-700' :
                                          i % 4 === 2 ? 'bg-green-100 text-green-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                        {c.salon}
                                    </span>

                                    {/* Disponibilidad */}
                                    <div className="flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${ocupado ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                        <span className={`text-xs font-medium ${ocupado ? 'text-red-500' : 'text-green-500'}`}>
                                            {ocupado ? 'Ocupado' : 'Disponible'}
                                        </span>
                                    </div>

                                    {/* Botón detalle */}
                                    <button
                                        onClick={() => setModalClase(claseAhora || c)}
                                        className="text-gray-400 hover:text-[#5E0006] text-lg">⋮</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div className="flex flex-col gap-4 w-72">

                {/* Header usuario */}
                <div className="flex items-center justify-end gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span className="text-sm font-bold text-gray-600">CECA</span>
                    <div className="w-9 h-9 rounded-full bg-[#5E0006] flex items-center justify-center text-white text-sm font-bold">
                        A
                    </div>
                </div>

                <Calendario />

                {/* Detalle profesor seleccionado */}
                {seleccionado && (
                    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                            👤
                        </div>
                        <p className="text-sm font-bold text-gray-700">{seleccionado.profesor}</p>
                        <div className="flex gap-3 text-gray-400">
                            <span className="cursor-pointer hover:text-[#5E0006]">📞</span>
                            <span className="cursor-pointer hover:text-[#5E0006]">💬</span>
                            <span className="cursor-pointer hover:text-[#5E0006]">✉️</span>
                        </div>
                        <div className="w-full text-sm mt-2 flex flex-col gap-1">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Ubicación</span>
                                <span className="font-medium">{seleccionado.salon}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Turno</span>
                                <span className="font-medium">
                                    {seleccionado.hora_inicio} - {seleccionado.hora_fin}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal salón */}
            <ModalSalon clase={modalClase} onClose={() => setModalClase(null)} />
        </div>
    )
}

export default Home
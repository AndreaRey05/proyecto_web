import { useState, useEffect } from 'react'
import API_URL, { getHeaders } from '../config'

const DIAS_MAP = { 0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado' }

function Calendario({ onDiaClick, diaSeleccionado }) {
    const hoy = new Date()
    const [mes, setMes] = useState(hoy.getMonth())
    const [anio, setAnio] = useState(hoy.getFullYear())

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

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

    const handleClick = (dia) => {
        if (!dia) return
        const fecha = new Date(anio, mes, dia)
        const nombreDia = DIAS_MAP[fecha.getDay()]
        onDiaClick(nombreDia, dia, mes, anio)
    }

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
                        {[2024, 2025, 2026, 2027].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <button onClick={siguiente} className="text-gray-500 hover:text-[#5E0006]">›</button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-1">
                {celdas.map((dia, i) => {
                    const fecha = dia ? new Date(anio, mes, dia) : null
                    const nombreDia = fecha ? DIAS_MAP[fecha.getDay()] : null
                    const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
                    const esSeleccionado = diaSeleccionado?.dia === dia &&
                        diaSeleccionado?.mes === mes &&
                        diaSeleccionado?.anio === anio
                    const esFinde = nombreDia === 'sabado' || nombreDia === 'domingo'

                    return (
                        <span key={i}
                            onClick={() => handleClick(dia)}
                            className={`py-1 rounded-full transition
                                ${!dia ? '' : esFinde ? 'text-gray-300' : 'cursor-pointer hover:bg-red-100'}
                                ${esHoy ? 'bg-[#5E0006] text-white font-bold hover:bg-[#5E0006]' : ''}
                                ${esSeleccionado && !esHoy ? 'bg-red-200 text-[#5E0006] font-bold' : ''}
                                ${!esHoy && !esSeleccionado ? 'text-gray-700' : ''}
                            `}>
                            {dia || ''}
                        </span>
                    )
                })}
            </div>
            {diaSeleccionado && (
                <button
                    onClick={() => onDiaClick(null)}
                    className="mt-2 text-xs text-gray-400 hover:text-[#5E0006] w-full text-center"
                >
                    Mostrar todos los días
                </button>
            )}
        </div>
    )
}

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
    const [diaSeleccionado, setDiaSeleccionado] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${API_URL}/api/horario`, { headers: getHeaders(token) })
            .then(r => r.json())
            .then(data => setClases(Array.isArray(data) ? data : []))
            .catch(() => setClases([]))
    }, [])

    const ahora = new Date()
    const diaActual = DIAS_MAP[ahora.getDay()]
    const horaActual = ahora.toTimeString().slice(0, 5)

    const handleDiaClick = (nombreDia, dia, mes, anio) => {
        if (!nombreDia) return setDiaSeleccionado(null)
        setDiaSeleccionado({ nombreDia, dia, mes, anio })
    }

    // Filtra por búsqueda y día seleccionado
    const clasesFiltradas = clases.filter(c => {
        const matchBusqueda =
            c.salon.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.profesor.toLowerCase().includes(busqueda.toLowerCase())
        const matchDia = diaSeleccionado
            ? c.dia === diaSeleccionado.nombreDia
            : true
        return matchBusqueda && matchDia
    })

    const salonesUnicos = diaSeleccionado
        ? clases.filter(c => c.dia === diaSeleccionado.nombreDia)
        : clases.filter(c => c.dia === diaActual)
        
    const estaOcupado = (salon) => {
        return clases.some(c =>
            c.salon === salon &&
            c.dia === diaActual &&
            horaActual >= c.hora_inicio.slice(0, 5) &&
            horaActual <= c.hora_fin.slice(0, 5)
        )
    }

    const claseActual = (salon) => {
        return clases.find(c =>
            c.salon === salon &&
            c.dia === diaActual &&
            horaActual >= c.hora_inicio.slice(0, 5) &&
            horaActual <= c.hora_fin.slice(0, 5)
        )
    }

    return (
        <div className="flex gap-4 p-6 h-full">

            {/* Centro */}
            <div className="flex-1 flex flex-col gap-4">

                {/* Barra búsqueda */}
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                        {diaSeleccionado
                            ? `Mostrando clases del ${diaSeleccionado.nombreDia}`
                            : 'Consulta la disponibilidad de aulas y salones en tiempo real.'}
                    </p>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow p-4 flex-1 overflow-auto">
                    <p className="font-bold text-gray-600 mb-3">Profesor</p>
                    <div className="flex flex-col gap-2">
                        {salonesUnicos.length === 0 && (
                            <p className="text-gray-400 text-sm text-center py-8">
                                {diaSeleccionado
                                    ? `No hay clases registradas para ${diaSeleccionado.nombreDia}`
                                    : 'No hay aulas registradas aún'}
                            </p>
                        )}
                        {salonesUnicos.map((c, i) => {
                            const ocupado = estaOcupado(c.salon)
                            const claseAhora = claseActual(c.salon)
                            return (
                                <div key={i}
                                    onClick={() => setSeleccionado(c)}
                                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition cursor-pointer">
                                    <div className="flex items-center gap-3 w-48">
                                        <div className="w-9 h-9 rounded-full bg-[#5E0006] flex items-center justify-center text-white text-sm font-bold">
                                            {c.profesor.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium truncate">{c.profesor}</span>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                                        ${i % 4 === 0 ? 'bg-pink-100 text-pink-700' :
                                            i % 4 === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                i % 4 === 2 ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                        {c.salon}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${ocupado ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                        <span className={`text-xs font-medium ${ocupado ? 'text-red-500' : 'text-green-500'}`}>
                                            {ocupado ? 'Ocupado' : 'Disponible'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); setModalClase(claseAhora || c) }}
                                        className="text-gray-400 hover:text-[#5E0006] text-lg">⋮</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Panel derecho */}
            <div className="flex flex-col gap-4 w-72">
                <div className="flex items-center justify-end gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="text-sm font-bold text-gray-600">CECA</span>
                    <div className="w-9 h-9 rounded-full bg-[#5E0006] flex items-center justify-center text-white text-sm font-bold">A</div>
                </div>

                <Calendario onDiaClick={handleDiaClick} diaSeleccionado={diaSeleccionado} />

                {/* Detalle profesor seleccionado */}
                {seleccionado && (
                    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
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
                                <span className="font-medium">{seleccionado.hora_entrada} - {seleccionado.hora_salida}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ModalSalon clase={modalClase} onClose={() => setModalClase(null)} />
        </div>
    )
}

export default Home
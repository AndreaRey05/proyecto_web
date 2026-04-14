import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import API_URL from '../config'

function ModalDetalle({ clase, onClose }) {
    if (!clase) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative">
                <button onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="text-center font-bold text-lg mb-4">{clase.title}</h2>
                <div className="text-sm flex flex-col gap-3">
                    <div>
                        <p className="text-gray-400 text-xs">Profesor asignado</p>
                        <p className="font-semibold">{clase.extendedProps?.profesor}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Horario</p>
                        <p className="font-semibold">
                            {clase.startStr?.slice(11,16)} - {clase.endStr?.slice(11,16)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Aula</p>
                        <p className="font-semibold">{clase.extendedProps?.salon}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Grupo</p>
                        <p className="font-semibold">{clase.extendedProps?.grupo}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ModalAnadir({ profesores, salones, grupos, materias, onGuardar, onClose }) {
    const [form, setForm] = useState({
        id_profesor: '', id_salon: '', id_grupo: '',
        id_materia: '', dia: 'lunes',
        hora_inicio: '', hora_fin: ''
    })

    const DIAS = ['lunes','martes','miercoles','jueves','viernes']
    const DIAS_LABEL = ['Lunes','Martes','Miércoles','Jueves','Viernes']

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleGuardar = () => {
        if (!form.id_profesor || !form.id_salon || !form.id_grupo ||
            !form.id_materia || !form.hora_inicio || !form.hora_fin)
            return alert('Completa todos los campos')
        onGuardar(form)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
                <button onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="font-bold text-lg mb-4 text-[#5E0006]">Añadir Clase</h2>
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <label className="text-gray-400 text-xs">Profesor</label>
                        <select name="id_profesor" value={form.id_profesor} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {profesores.map(p => (
                                <option key={p.num_cuenta} value={p.num_cuenta}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Materia</label>
                        <select name="id_materia" value={form.id_materia} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {materias.map(m => (
                                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Salón</label>
                        <select name="id_salon" value={form.id_salon} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {salones.map(s => (
                                <option key={s.id_salon} value={s.id_salon}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Grupo</label>
                        <select name="id_grupo" value={form.id_grupo} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {grupos.map(g => (
                                <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Día</label>
                        <select name="dia" value={form.dia} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            {DIAS.map((d, i) => (
                                <option key={d} value={d}>{DIAS_LABEL[i]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs">Hora inicio</label>
                            <input type="time" name="hora_inicio" value={form.hora_inicio}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 mt-1" />
                        </div>
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs">Hora fin</label>
                            <input type="time" name="hora_fin" value={form.hora_fin}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 mt-1" />
                        </div>
                    </div>
                </div>
                <button onClick={handleGuardar}
                    className="mt-4 w-full bg-[#5E0006] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#7a000a] transition">
                    Guardar
                </button>
            </div>
        </div>
    )
}

// Convierte día en español a número (0=domingo, 1=lunes...)
const diaANumero = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 }

function Horarios({ rol }) {
    const [clases, setClases]         = useState([])
    const [profesores, setProfesores] = useState([])
    const [salones, setSalones]       = useState([])
    const [grupos, setGrupos]         = useState([])
    const [materias, setMaterias]     = useState([])
    const [modalDetalle, setModalDetalle] = useState(null)
    const [modalAnadir, setModalAnadir]   = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const cargarClases = () => {
        fetch(`${API_URL}/api/horario`, { headers })
            .then(r => r.json())
            .then(data => setClases(Array.isArray(data) ? data : []))
            .catch(() => setClases([]))
    }

    useEffect(() => {
        cargarClases()
        if (rol === 'administrador') {
            fetch(`${API_URL}/api/profesores`, { headers })
                .then(r => r.json()).then(d => setProfesores(Array.isArray(d) ? d : []))
            fetch(`${API_URL}/api/salones`, { headers })
                .then(r => r.json()).then(d => setSalones(Array.isArray(d) ? d : []))
            fetch(`${API_URL}/api/grupos`, { headers })
                .then(r => r.json()).then(d => setGrupos(Array.isArray(d) ? d : []))
            fetch(`${API_URL}/api/materias`, { headers })
                .then(r => r.json()).then(d => setMaterias(Array.isArray(d) ? d : []))
        }
    }, [])

    // Convierte clases de BD a eventos de FullCalendar
    const coloresEventos = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899']

    const eventos = clases.map((c, i) => {
        const diaN = diaANumero[c.dia]
        const fecha = new Date(2024, 0, 7 + diaN)
        const fechaStr = fecha.toISOString().slice(0, 10)
        return {
            id: c.id_clase,
            title: c.materia,
            start: `${fechaStr}T${c.hora_inicio}`,
            end:   `${fechaStr}T${c.hora_fin}`,
            backgroundColor: coloresEventos[i % coloresEventos.length],
            borderColor: 'transparent',
            extendedProps: {
                profesor: c.profesor,
                salon:    c.salon,
                grupo:    c.grupo
            }
        }
    })

    const handleGuardar = async (form) => {
        const res = await fetch(`${API_URL}/api/horario`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        const data = await res.json()
        if (!res.ok) return alert(data.error)
        setModalAnadir(false)
        cargarClases()
    }

    

    return (
        <div className="flex flex-col gap-4 p-6 h-full">

            {/* Botón añadir — solo admin */}
            {rol === 'administrador' && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setModalAnadir(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition"
                    >
                        Añadir clase +
                    </button>
                </div>
            )}

            {/* Calendario */}
            <div className="bg-white rounded-2xl shadow p-4 flex-1">
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    initialDate="2024-01-08"
                    headerToolbar={false}
                    dayHeaderFormat={{ weekday: 'long' }}
                    hiddenDays={[0, 6]}
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    slotDuration="01:00:00"
                    allDaySlot={false}
                    expandRows={true}
                    events={eventos}
                    eventClick={(info) => setModalDetalle(info.event)}
                    height="600px"
                    locale="es"
                />
            </div>

            {modalDetalle && <ModalDetalle clase={modalDetalle} onClose={() => setModalDetalle(null)} />}
            {modalAnadir  && (
                <ModalAnadir
                    profesores={profesores}
                    salones={salones}
                    grupos={grupos}
                    materias={materias}
                    onGuardar={handleGuardar}
                    onClose={() => setModalAnadir(false)}
                />
            )}
        </div>
    )
}

export default Horarios
import { useState, useEffect } from 'react'
import API_URL from '../config'

const HORAS = ['7:00','8:00','9:00','10:00','11:00','12:00',
               '13:00','14:00','15:00','16:00','17:00']
const DIAS  = ['lunes','martes','miercoles','jueves','viernes']
const DIAS_LABEL = ['Lunes','Martes','Miércoles','Jueves','Viernes']

// Modal detalle de clase al hacer click
function ModalDetalle({ clase, onClose }) {
    if (!clase) return null
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative">
                <button onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="text-center font-bold text-lg mb-4">{clase.materia}</h2>
                <div className="text-sm flex flex-col gap-3">
                    <div>
                        <p className="text-gray-400 text-xs">Profesor asignado</p>
                        <p className="font-semibold">{clase.profesor}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Horario</p>
                        <p className="font-semibold">{clase.hora_inicio} - {clase.hora_fin}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Aula</p>
                        <p className="font-semibold">{clase.salon}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Grupo</p>
                        <p className="font-semibold">{clase.grupo}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Modal para añadir clase — solo admin
function ModalAnadir({ profesores, salones, grupos, materias, onGuardar, onClose }) {
    const [form, setForm] = useState({
        id_profesor: '', id_salon: '', id_grupo: '',
        id_materia: '', dia: 'lunes',
        hora_inicio: '', hora_fin: ''
    })

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleGuardar = async () => {
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
                        <select name="id_profesor" value={form.id_profesor}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {profesores.map(p => (
                                <option key={p.num_cuenta} value={p.num_cuenta}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Materia</label>
                        <select name="id_materia" value={form.id_materia}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {materias.map(m => (
                                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Salón</label>
                        <select name="id_salon" value={form.id_salon}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {salones.map(s => (
                                <option key={s.id_salon} value={s.id_salon}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Grupo</label>
                        <select name="id_grupo" value={form.id_grupo}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1">
                            <option value="">Seleccionar...</option>
                            {grupos.map(g => (
                                <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs">Día</label>
                        <select name="dia" value={form.dia}
                            onChange={handleChange}
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

function Horarios({ rol }) {
    const [clases, setClases]       = useState([])
    const [profesores, setProfesores] = useState([])
    const [salones, setSalones]     = useState([])
    const [grupos, setGrupos]       = useState([])
    const [materias, setMaterias]   = useState([])
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

    const getClase = (dia, hora) => {
        return clases.find(c => {
            const ini = c.hora_inicio.slice(0, 5)
            const fin = c.hora_fin.slice(0, 5)
            const h   = hora.padStart(5, '0')
            return c.dia === dia && h >= ini && h < fin
        })
    }

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
        <div className="flex gap-4 p-6 h-full">
            <div className="flex-1 flex flex-col gap-4">

                {/* Botón añadir — solo admin */}
                {rol === 'administrador' && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setModalAnadir(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition flex items-center gap-2"
                        >
                            Añadir clase +
                        </button>
                    </div>
                )}

                {/* Tabla horario */}
                <div className="bg-white rounded-2xl shadow overflow-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="p-3 text-left text-gray-400 w-16"></th>
                                {DIAS_LABEL.map(d => (
                                    <th key={d} className="p-3 text-center text-gray-600 font-bold">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {HORAS.map(hora => (
                                <tr key={hora} className="border-t border-gray-100">
                                    <td className="p-2 text-xs text-gray-400 text-right pr-3">{hora}</td>
                                    {DIAS.map(dia => {
                                        const clase = getClase(dia, hora)
                                        return (
                                            <td key={dia} className="p-1 border-l border-gray-100 h-12 align-top">
                                                {clase && clase.hora_inicio.slice(0,5) === hora.padStart(5,'0') && (
                                                    <div
                                                        onClick={() => setModalDetalle(clase)}
                                                        className="bg-blue-100 text-blue-800 text-xs rounded p-1 cursor-pointer hover:bg-blue-200 transition leading-tight"
                                                    >
                                                        <p className="font-bold truncate">{clase.materia}</p>
                                                        <p className="truncate text-blue-600">{clase.salon}</p>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Lista profesores abajo */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <p className="font-bold text-gray-600 mb-3">Profesores</p>
                    <div className="flex flex-col gap-2">
                        {[...new Map(clases.map(c => [c.profesor, c])).values()].map((c, i) => {
                            const colores = ['bg-yellow-100','bg-pink-100','bg-blue-100','bg-green-100']
                            return (
                                <div key={i} className={`${colores[i % colores.length]} rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2`}>
                                    <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-xs">👤</div>
                                    {c.profesor}
                                </div>
                            )
                        })}
                    </div>
                </div>
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
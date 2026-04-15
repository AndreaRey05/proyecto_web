import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uaeh from '../assets/uaeh.png'
import Home from '../components/Home'
import Profesores from '../components/Profesores'
import Horarios from '../components/Horarios'

function Dashboard() {
    const [seccion, setSeccion] = useState('home')
    const navigate = useNavigate()
    const rol = localStorage.getItem('rol')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('rol')
        navigate('/')
    }

    return (
        <div className="flex h-screen bg-[#f0f0f0] overflow-hidden">
            <div className="flex flex-col">
               <img src={R} alt="UAEH" className="w-24 h-24 object-contain mb-2" />
            {/* Sidebar */}
            
            <div className="w-44 bg-[#5E0006] flex flex-col items-start py-6 gap-2 rounded-lg h-[810px]  mb-3 ">
                
                <div className="px-4 mb-4">
                     
                    <p className="text-white text-[10px] mt-1 leading-tight font-serif">
                        Universidad Autónoma<br />del Estado de Hidalgo
                    </p>
                </div>
            

                {/* Tabs superiores */}
                <div className="flex gap-2 px-4 mb-4">
                    <span className="text-white text-[10px] cursor-pointer hover:underline">ESTL</span>
                    <span className="text-white text-[10px] cursor-pointer hover:underline">IS</span>
                    <span className="text-white text-[10px] cursor-pointer hover:underline">SAESTL</span>
                </div>

                {/* Menú */}
                <button
                    onClick={() => setSeccion('home')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-white font-bold text-sm tracking-wide transition
                        ${seccion === 'home' ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10'}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                </button>

                <button
                    onClick={() => setSeccion('profesores')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-white font-bold text-sm tracking-wide transition
                        ${seccion === 'profesores' ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10'}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Profesores
                </button>

                <button
                    onClick={() => setSeccion('horarios')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-white font-bold text-sm tracking-wide transition
                        ${seccion === 'horarios' ? 'bg-white/20 border-l-4 border-white' : 'hover:bg-white/10'}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Horarios
                </button>

                {/* Cerrar sesión al fondo */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition mt-auto"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                </button>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 overflow-auto">
                {seccion === 'home'       && <Home rol={rol} />}
                {seccion === 'profesores' && <Profesores rol={rol} />}
                {seccion === 'horarios'   && <Horarios rol={rol} />}
            </div>
        </div>
    )
}

export default Dashboard
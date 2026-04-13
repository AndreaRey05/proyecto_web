import { useNavigate } from 'react-router-dom'
import uaeh from '../assets/uaeh.png'
import API_URL from '../config'

function AccesoGeneral() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-center gap-10">
            
            {/* Logo y título */}
            <div className="flex items-center gap-4">
                <img src={uaeh} alt="UAEH" className="w-12 h-12 object-contain" />
                <h1 className="text-[#5E0006] text-3xl font-bold tracking-widest">
                    ACCESO GENERAL
                </h1>
            </div>

            {/* Botones */}
            <div className="flex gap-6">
                <button
                    onClick={() => navigate('/login-profesor')}
                    className="bg-[#5E0006] text-white px-10 py-4 text-lg font-bold tracking-widest rounded hover:bg-[#7a000a] transition"
                >
                    PROFESORADO
                </button>
                <button
                    onClick={() => navigate('/login-alumno')}
                    className="bg-[#5E0006] text-white px-10 py-4 text-lg font-bold tracking-widest rounded hover:bg-[#7a000a] transition"
                >
                    ALUMNADO
                </button>
                <button
                    onClick={() => navigate('/login-admin')}
                    className="bg-[#5E0006] text-white px-10 py-4 text-lg font-bold tracking-widest rounded hover:bg-[#7a000a] transition"
                >
                    ADMINISTRADORES
                </button>
            </div>
        </div>
    )
}

export default AccesoGeneral
import { useState } from 'react';
import uaeh from '../assets/uaeh.png';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [modo, setModo] = useState('login');
    const [ncuenta, setncuenta] = useState('');
    const [nip, setnip] = useState('');
    const [entrada, setEntrada] = useState('');
    const [salida, setSalida] = useState('');
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault()

    if (modo === 'login') {
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    num_cuenta: parseInt(ncuenta),
                    contra: nip,
                    rol: 'profesor'
                })
            })

            const data = await res.json()
            if (!res.ok) return alert(data.error)

            localStorage.setItem('token', data.token)
            localStorage.setItem('rol', data.rol)
            navigate('/dashboard')

        } catch (error) {
            alert('Error al conectar con el servidor')
        }

    } else {
        // SIGN IN — registro de profesor
        try {
            const res = await fetch('http://localhost:3000/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    num_cuenta: parseInt(ncuenta),
                    nombre,
                    contra: nip,
                    hora_entrada: entrada,
                    hora_salida: salida
                })
            })

            const data = await res.json()
            if (!res.ok) return alert(data.error)

            alert('Registro exitoso, ahora puedes iniciar sesión')
            setModo('login')

        } catch (error) {
            alert('Error al conectar con el servidor')
        }
    }
};

    return (
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
            <div className="flex w-[580px] bg-white rounded-2xl overflow-hidden shadow-xl">

                {/* Panel izquierdo rosa */}
                <div className="w-48 bg-[#5E0006] relative flex flex-col items-end justify-center p-8 gap-6 overflow-hidden">
                    <div className="absolute top-[-40px] left-[-60px] w-44 h-44 bg-[#F77F00] opacity-50 rotate-45 rounded-2xl"></div>
                    <div className="absolute bottom-[-50px] left-[-40px] w-52 h-52 bg-[#FFD45A] opacity-60 rotate-45 rounded-2xl"></div>

                    {/* Botón LOGIN */}
                    <button
                        onClick={() => setModo('login')}
                        className={`relative z-10 rounded-xl px-4 py-2 text-sm font-bold tracking-widest transition ${modo === 'login'
                                ? 'bg-white text-[#5E0006]'
                                : 'bg-transparent text-white hover:underline'
                            }`}
                    >
                        LOGIN
                    </button>

                    {/* Botón SIGN IN */}
                    <button
                        onClick={() => setModo('signin')}
                        className={`relative z-10 text-xs font-medium tracking-widest transition ${modo === 'signin'
                                ? 'bg-white text-[#5E0006] rounded-xl px-4 py-2'
                                : 'text-white hover:underline'
                            }`}
                    >
                        SIGN IN
                    </button>
                </div>

                {/* Panel derecho */}
                <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">

                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-2 border-[#5E0006] flex items-center justify-center ">
                        <img src={uaeh} alt="Avatar" className="w-full h-full object-contain" />
                    </div>

                    <p className="text-[#5E0006] font-bold tracking-widest text-lg">
                        {modo === 'login' ? 'LOGIN' : 'SIGN IN'}
                    </p>

                    {/* numero de cuenta  */}
                    <div className="w-full border-b border-gray-300 flex items-center gap-2 pb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            type="ncuenta"
                            placeholder="Número de Cuenta"
                            value={ncuenta}
                            onChange={(e) => setncuenta(e.target.value)}
                            className="flex-1 outline-none text-sm bg-transparent"
                        />
                    </div>

                    {/* Nip */}
                    <div className="w-full border-b border-gray-300 flex items-center gap-2 pb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Nip"
                            value={nip}
                            onChange={(e) => setnip(e.target.value)}
                            className="flex-1 outline-none text-sm bg-transparent"
                        />
                    </div>

                    {/* Hora de entrada y salida — solo en SIGN IN */}
                    {modo === 'signin' && (
                        <>
                          <div className="w-full border-b border-gray-300 flex items-center gap-2 pb-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="flex-1 outline-none text-sm bg-transparent"
                                />
                            </div>
                            <div className="w-full border-b border-gray-300 flex items-center gap-2 pb-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <label className="text-xs text-gray-400 w-16">Entrada</label>
                                <input
                                    type="time"
                                    value={entrada}
                                    onChange={(e) => setEntrada(e.target.value)}
                                    className="flex-1 outline-none text-sm bg-transparent"
                                />
                            </div>

                            <div className="w-full border-b border-gray-300 flex items-center gap-2 pb-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <label className="text-xs text-gray-400 w-16">Salida</label>
                                <input
                                    type="time"
                                    value={salida}
                                    onChange={(e) => setSalida(e.target.value)}
                                    className="flex-1 outline-none text-sm bg-transparent"
                                />
                            </div>


                        </>
                    )}

                    {/* Forgot + Botón */}
                    <div className="w-full flex items-center justify-between mt-1">
                        {modo === 'login' && (
                            <span className="text-[#5E0006] text-xs cursor-pointer">Forgot Nip?</span>
                        )}
                        <button
                            onClick={handleSubmit}
                            className="ml-auto bg-[#5E0006] text-white px-6 py-2 rounded-lg text-sm font-bold tracking-widest hover:bg-[#5E0006] transition"
                        >
                            {modo === 'login' ? 'LOGIN' : 'SIGN IN'}
                        </button>
                    </div>





                </div>
            </div>
        </div>
    );
}

export default Login;
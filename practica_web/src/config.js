//const API_URL = 'https://PRUEBA-CAMBIO-123.ngrok-free.dev'
const API_URL = 'http://192.168.3.19:3000'

export const getHeaders = (token, includeContentType = false) => {
    const h = {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
    }
    if (includeContentType) h['Content-Type'] = 'application/json'
    return h
}

export default API_URL
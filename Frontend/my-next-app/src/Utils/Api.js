
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://sastazonpk-production.up.railway.app',
    withCredentials: true
})

export default api

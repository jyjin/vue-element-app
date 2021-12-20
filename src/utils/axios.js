
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:30010'
})
instance.defaults.headers.common['migration-token'] = 'jyjin'

export default instance
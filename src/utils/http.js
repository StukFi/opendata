import axios from 'axios'

export default {
    async get(url) {
            const response = await axios.get(url)
            return response
    }
}
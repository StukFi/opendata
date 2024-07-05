import axios from 'axios'

export default {
    async get(url) {
        try {
            const response = await axios.get(url)
            return response
        } catch (error) {
            throw error
        }
    }
}

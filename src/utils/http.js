import Vue from "vue"

export default {
    async get (url) {
        return await Vue.http.get(url)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }
}

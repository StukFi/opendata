/**
 * Create a promise that resolves after the given number of milliseconds.
 * @async
 * @param {Number} ms
 * @return {Promise}
 */
export function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

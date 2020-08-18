import Vue from "vue"

/** Class repsenting the map legend. */
class MapLegend {
    constructor () {
        this.bars = []

        this.addBar(new MapLegendBar(0.00, "#1dafaf"))
        this.addBar(new MapLegendBar(0.10, "#1d8baf"))
        this.addBar(new MapLegendBar(0.20, "#1d66af"))
        this.addBar(new MapLegendBar(0.30, "#1d41af"))
        this.addBar(new MapLegendBar(0.40, "#411daf"))
    }

    /**
     * Add a bar to the map legend.
     * @param {Object} bar
     */
    addBar (bar) {
        let tail = this.bars.slice(-1)[0]
        if (tail) {
            tail.nextBar = bar
        }

        this.bars.push(bar)
    }

    /**
     * Toggle the state of a bar.
     * @param {Number} index
     */
    toggleBar (index) {
        var bar = this.bars[index]
        bar.toggleState()
        Vue.set(this.bars, index, bar)
    }

    /**
     * Clear the map legend of bars.
     */
    clear () {
        this.bars = []
    }

    /**
     * Return a custom string representation for saving settings.
     */
    toString () {
        return JSON.stringify(this.bars.map(bar => bar.toString()))
    }
}

/** Class representing a map legend bar. */
export class MapLegendBar {
    constructor (threshold, color) {
        this.nextBar = undefined
        this.threshold = threshold < 10 ? threshold.toFixed(2) : threshold
        this.color = color
        this.isEnabled = true
    }

    get label () {
        if (this.nextBar) {
            return `${this.threshold} - ${this.nextBar.threshold}`
        }
        else {
            return `> ${this.threshold} µSv/h`
        }
    }

    toggleState () {
        this.isEnabled = !this.isEnabled
    }

    toString () {
        return `{"threshold": ${this.threshold}, "color": "${this.color}"}`
    }
}

export default MapLegend

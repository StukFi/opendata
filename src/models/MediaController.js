import { reactive } from 'vue'
import store from "@/store/index"

class MediaController {
    constructor() {
        // Reactive state object
        this.state = reactive({
            isPlaybackEnabled: false,
            playbackMode: "time",
            playbackSpeed: 1000,
            playbackSpeeds: [500, 1000, 2000],
            playbackTimeoutId: undefined
        })
    }

    play() {
        if (this.state.isPlaybackEnabled) {
            return
        }

        this.state.isPlaybackEnabled = true
        this.tick()
    }

    stop() {
        this.state.isPlaybackEnabled = false
        clearTimeout(this.state.playbackTimeoutId)
    }

    async tick() {
        if (!this.state.isPlaybackEnabled) {
            return
        }

        if (this.isPlaybackFinished()) {
            this.stop()
            return
        }

        if (this.state.playbackMode === "date") {
            await store.dispatch("incrementDate")
        } else if (this.state.playbackMode === "time") {
            await store.dispatch("incrementTime")
        }

        this.state.playbackTimeoutId = setTimeout(() => this.tick(), this.state.playbackSpeed)
    }

    togglePlayback() {
        this.state.isPlaybackEnabled ? this.stop() : this.play()
    }

    toggleMode() {
        this.state.playbackMode = (this.state.playbackMode === "date") ? "time" : "date"
    }

    toggleSpeed() {
        const index = this.state.playbackSpeeds.indexOf(this.state.playbackSpeed)
        this.state.playbackSpeed = (index >= this.state.playbackSpeeds.length - 1) ? this.state.playbackSpeeds[0] : this.state.playbackSpeeds[index + 1]
    }

    isPlaybackFinished() {
        return (this.state.playbackMode === "time" && store.getters.isNewestTimeSelected) ||
               (this.state.playbackMode === "date" && store.getters.isNewestDateSelected)
    }
}

// Function to create a reactive media controller instance
export function createMediaController() {
    return new MediaController()
}

export default MediaController

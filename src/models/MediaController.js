import store from "@/store/index"

/** Enum representing media controller playback modes. */
export class PlaybackMode {
    constructor (name) {
        this.name = name
    }

    static Date = new PlaybackMode("date")
    static Time = new PlaybackMode("time")
}

/** Class representing a media controller for playback of datasets. */
class MediaController {
    constructor () {
        this.isPlaybackEnabled = false
        this.playbackMode = PlaybackMode.Time
        this.playbackSpeed = 1000
        this.playbackSpeeds = [500, 1000, 2000]
        this.playbackTimeoutId = undefined
    }

    /** Start playback. */
    play () {
        if (this.isPlaybackEnabled) {
            return
        }

        this.isPlaybackEnabled = true
        this.tick()
    }

    /** Stop playback. */
    stop () {
        this.isPlaybackEnabled = false
        clearTimeout(this.playbackTimeoutId)
    }

    /** Internal function for handling playback. */
    async tick () {
        if (!this.isPlaybackEnabled) {
            return
        }

        if (this.isPlaybackEndReached()) {
            this.stop()
            return
        }

        if (this.playbackMode == PlaybackMode.Date) {
            await store.dispatch("incrementDate")
        }
        else if (this.playbackMode == PlaybackMode.Time) {
            await store.dispatch("incrementTime")
        }

        this.playbackTimeoutId = setTimeout(() => this.tick(), this.playbackSpeed)
    }

    /** Toggle playback state. */
    togglePlayback () {
        this.isPlaybackEnabled ? this.stop() : this.play()
    }

    /** Toggle playback mode. */
    toggleMode () {
        this.playbackMode = (this.playbackMode == PlaybackMode.Date) ? PlaybackMode.Time : PlaybackMode.Date
    }

    /** Toggle playback speed. */
    toggleSpeed () {
        var index = this.playbackSpeeds.indexOf(this.playbackSpeed)
        if (index >= this.playbackSpeeds.length - 1) {
            this.playbackSpeed = this.playbackSpeeds[0]
        }
        else {
            this.playbackSpeed = this.playbackSpeeds[++index]
        }
    }

    /** Indicates whether playback has reached the end of available datasets. */
    isPlaybackEndReached () {
        return (this.playbackMode == PlaybackMode.Time && store.getters.isLastTimeSelected) ||
            (this.playbackMode == PlaybackMode.Date && store.getters.isLastDateSelected)
    }
}

export default MediaController

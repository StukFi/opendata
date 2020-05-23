<template>
    <div class="media-controller">
        <button-playback-mode
            :playback-mode="playbackMode"
            @click="toggleMode()"
        />
        <button-playback-state
            :playback-enabled="playbackEnabled"
            @click="togglePlayback()"
        />
        <button-playback-speed
            :playback-speed="playbackSpeed"
            @click="toggleSpeed()"
        />
    </div>
</template>

<script>
import ButtonPlaybackState from "./ButtonPlaybackState"
import ButtonPlaybackMode from "./ButtonPlaybackMode"
import ButtonPlaybackSpeed from "./ButtonPlaybackSpeed"

export default {
    name: "MediaController",
    components: {
        ButtonPlaybackState,
        ButtonPlaybackMode,
        ButtonPlaybackSpeed
    },
    data: function () {
        return {
            playbackEnabled: false,
            playbackMode: "time",
            playbackSpeed: 1000,
            playbackSpeeds: [500, 1000, 2000],
            playbackTimeoutId: undefined
        }
    },
    methods: {
        togglePlayback () {
            this.playbackEnabled ? this.pause() : this.play()
        },
        toggleMode () {
            this.playbackMode = (this.playbackMode == "date") ? "time" : "date"
        },
        toggleSpeed () {
            var index = this.playbackSpeeds.indexOf(this.playbackSpeed)
            if (index >= this.playbackSpeeds.length - 1) {
                this.playbackSpeed = this.playbackSpeeds[0]
            } else {
                this.playbackSpeed = this.playbackSpeeds[++index]
            }
        },
        play () {
            if (this.playbackEnabled || this.playbackTimeoutId) {
                return
            }

            var that = this
            this.playbackEnabled = true;

            (function loadNextDataset () {
                if ((that.playbackMode == "time" && that.$store.getters.isLastTimeSelected) ||
                    (that.playbackMode == "date" && that.$store.getters.isLastDateSelected)) {
                    that.pause()
                    return
                }

                if (that.playbackMode == "date") {
                    that.$store.dispatch("incrementDate")
                } else if (that.playbackMode == "time") {
                    that.$store.dispatch("incrementTime")
                }

                that.playbackTimeoutId = setTimeout(loadNextDataset, that.playbackSpeed)
            })()
        },
        pause () {
            this.playbackEnabled = false
            if (this.playbackTimeoutId) {
                clearTimeout(this.playbackTimeoutId)
                this.playbackTimeoutId = undefined
            }
        }
    }
}
</script>

<style>
.media-controller {
    width: 200px;
    height: 40px;
    position: absolute;
    bottom: 40px;
    left: 50%;
    display: flex;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 1;
    padding: 3px;
    border-radius: 4px;
}

.media-controller:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

@media only screen and (max-width: 500px) {
    .media-controller {
        display: none;
    }
}
</style>

<template>
    <div class="media-controls">
        <span class="media-controls__button media-controls__button-datetime" v-bind:class="{'media-controls__button-time': playbackMode == 'time', 'media-controls__button-date': playbackMode == 'date'}"@click="toggleMode()"></span>
        <span class="media-controls__button" v-bind:class="{'media-controls__button-play': !playbackEnabled, 'media-controls__button-pause': playbackEnabled}" @click="togglePlayback()"></span>
        <span class="media-controls__button media-controls__button-speed" @click="toggleSpeed()">{{playbackSpeed | formatSpeed}}</span>
    </div>
</template>

<script>
export default {
    name: "MediaControls",
    data: function() {
        return {
            playbackEnabled: false,
            playbackMode: "time",
            playbackSpeed: 1000,
            playbackSpeeds: [500, 1000, 2000],
            playbackTimeoutId: undefined
        };
    },
    methods: {
        togglePlayback() {
            this.playbackEnabled ? this.pause() : this.play();
        },
        play() {
            if (this.playbackEnabled || this.playbackTimeoutId) {
                return;
            }

            var that = this;
            this.playbackEnabled = true;

            (function loadNextDataset() {
                if ((that.playbackMode == "time" && that.$store.getters.isLastTimeSelected) ||
                    (that.playbackMode == "date" && that.$store.getters.isLastDateSelected)) {
                    that.pause();
                    return;
                }

                if (that.playbackMode == "date") {
                    that.$store.dispatch("incrementDate");
                }
                else if (that.playbackMode == "time") {
                    that.$store.dispatch("incrementTime");
                }

                that.playbackTimeoutId = setTimeout(loadNextDataset, that.playbackSpeed);
            })();
        },
        pause() {
            this.playbackEnabled = false;
            if (this.playbackTimeoutId) {
                clearTimeout(this.playbackTimeoutId);
                this.playbackTimeoutId = undefined;
            }
        },
        toggleMode() {
            this.playbackMode = (this.playbackMode == "date") ? "time" : "date";
        },
        toggleSpeed() {
            var index = this.playbackSpeeds.indexOf(this.playbackSpeed);
            if (index >= this.playbackSpeeds.length - 1) {
                this.playbackSpeed = this.playbackSpeeds[0];
            }
            else {
                this.playbackSpeed = this.playbackSpeeds[++index];
            }
        }
    },
    filters: {
        formatSpeed(playbackSpeed) {
            return playbackSpeed / 1000.0 + " s";
        }
    }
}
</script>

<style>
.media-controls {
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

.media-controls:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.media-controls__button {
    width: 32%;
    height: 100%;
    margin: auto;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 1em;
    background-color: rgba(0, 60, 136, 0.5);
}

.media-controls__button:hover {
    background-color: rgba(0, 60, 136, 0.7);
}

.media-controls__button-datetime {
    border-radius: 2px 0px 0px 2px;
}

.media-controls__button-date {
    background-image: url("../../assets/icons/calendar.svg");
}

.media-controls__button-time {
    background-image: url("../../assets/icons/clock.svg");
}

.media-controls__button-play {
    background-image: url("../../assets/icons/media-play.svg");
}

.media-controls__button-pause {
    background-image: url("../../assets/icons/media-pause.svg");
}

.media-controls__button-speed {
    border-radius: 0px 2px 2px 0px;
    float: right;
    text-align: center;
    line-height: 32px;
    color: white;
    font-weight: bold;
}

@media only screen and (max-width: 500px) {
    .media-controls {
        display: none;
    }
}
</style>
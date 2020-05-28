<template>
    <media-controller-button
        :icon="icon"
        :disabled="disabled"
        :title="title"
        @click="mediaController.togglePlayback()"
    />
</template>

<script>
import MediaControllerButton from "./MediaControllerButton"
import { PlaybackMode } from "@/models/MediaController"

export default {
    name: "ButtonPlaybackState",
    components: {
        MediaControllerButton
    },
    props: {
        mediaController: {
            type: Object,
            required: true
        }
    },
    computed: {
        icon () {
            return this.mediaController.isPlaybackEnabled ? "media-pause" : "media-play"
        },
        disabled () {
            return this.mediaController.isPlaybackFinished()
        },
        title () {
            if (this.disabled) {
                if (this.mediaController.playbackMode == PlaybackMode.Time) {
                    return this.$t("title.disabled.time")
                }
                else if (this.mediaController.playbackMode == PlaybackMode.Date) {
                    return this.$t("title.disabled.date")
                }
            }
            else {
                if (this.mediaController.isPlaybackEnabled) {
                    return this.$t("title.stop")
                }
                else {
                    return this.$t("title.start")
                }
            }

            return ""
        }
    }
}
</script>

<i18n>
{
    "fi": {
        "title": {
            "disabled": {
                "date": "Valitse aikaisempi päivämäärä",
                "time": "Valitse aikaisempi kellonaika"
            },
            "start": "Aloita toisto",
            "stop": "Pysäytä toisto"
        }
    },
    "en": {
        "title": {
            "disabled": {
                "date": "Choose an earlier date to enable playback",
                "time": "Choose an earlier time to enable playback"
            },
            "start": "Start playback",
            "stop": "Stop playback"
        }
    }
}
</i18n>

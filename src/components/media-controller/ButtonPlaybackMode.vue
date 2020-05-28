<template>
    <media-controller-button
        :icon="icon"
        :title="title"
        @click="mediaController.toggleMode()"
    />
</template>

<script>
import MediaControllerButton from "./MediaControllerButton"
import { PlaybackMode } from "@/models/MediaController"

export default {
    name: "ButtonPlaybackMode",
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
            return this.mediaController.playbackMode == PlaybackMode.Time ? "clock" : "calendar"
        },
        title () {
            if (this.mediaController.playbackMode == PlaybackMode.Time) {
                return this.$t("title.time")
            }
            else if (this.mediaController.playbackMode == PlaybackMode.Date) {
                return this.$t("title.date")
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
            "date": "Päivitä päivämäärää",
            "time": "Päivitä kellonaikaa"
        }
    },
    "en": {
        "title": {
            "date": "Update date",
            "time": "Update time"
        }
    }
}
</i18n>

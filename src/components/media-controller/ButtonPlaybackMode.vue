<template>
    <media-controller-button
        :icon="icon"
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
        }
    }
}
</script>

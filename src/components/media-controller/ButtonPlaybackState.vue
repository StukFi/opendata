<template>
    <media-controller-button
        :icon="icon"
        :disabled="disabled"
        @click="mediaController.togglePlayback()"
    />
</template>

<script>
import MediaControllerButton from "./MediaControllerButton"

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
            return this.mediaController.isPlaybackEndReached()
        }
    }
}
</script>

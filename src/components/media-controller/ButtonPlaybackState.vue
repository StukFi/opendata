<template>
    <media-controller-button
        :icon="icon"
        :disabled="disabled"
        @click="$emit('click')"
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
        playbackEnabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        icon () {
            return this.playbackEnabled ? "media-pause" : "media-play"
        },
        disabled () {
            return this.$store.getters.isLastDateSelected && this.$store.getters.isLastTimeSelected
        }
    }
}
</script>

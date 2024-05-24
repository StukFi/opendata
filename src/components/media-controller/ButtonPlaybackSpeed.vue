<template>
    <media-controller-button
        :text="playbackSpeed"
        :title="$t('playback.title.speed')"
        @click="mediaController.toggleSpeed()"
    />
</template>

<script>
import MediaControllerButton from "./MediaControllerButton"

export default {
    name: "ButtonPlaybackSpeed",
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
        playbackSpeed () {
            return this.mediaController.playbackSpeed / 1000.0 + " s"
        }
    }
}
</script>

<style lang="scss" scoped>
button {
    font-size: $font-sm;
}
</style>
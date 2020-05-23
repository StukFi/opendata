<template>
    <media-controller-button
        :text="text"
        @click="$emit('click')"
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
        playbackSpeed: {
            type: Number,
            default: 1000
        }
    },
    computed: {
        text () {
            return this.playbackSpeed / 1000.0 + " s"
        }
    }
}
</script>

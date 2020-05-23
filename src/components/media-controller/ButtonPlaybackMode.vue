<template>
    <media-controller-button
        :icon="icon"
        @click="$emit('click')"
    />
</template>

<script>
import MediaControllerButton from "./MediaControllerButton"

export default {
    name: "ButtonPlaybackMode",
    components: {
        MediaControllerButton
    },
    props: {
        playbackMode: {
            type: String,
            default: "date"
        }
    },
    computed: {
        icon () {
            return this.playbackMode  == "time" ? "clock" : "calendar"
        }
    }
}
</script>

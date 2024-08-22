<template>
    <media-controller-button
        :icon="icon"
        :title="title"
        @click="handleClick"
    />
</template>

<script>
import MediaControllerButton from "@/components/media-controller/MediaControllerButton.vue"

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
        icon() {
            return this.mediaController.state.playbackMode === "time" ? "clock" : "calendar"
        },
        title() {
            return this.mediaController.state.playbackMode === "time"
                ? this.$t("playback.title.time")
                : this.$t("playback.title.date")
        }
    },
    methods: {
        handleClick() {
            this.mediaController.toggleMode()
        }
    }
}
</script>

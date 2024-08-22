<template>
    <media-controller-button
        :icon="icon"
        :disabled="disabled"
        :title="title"
        @click="handleClick"
    />
</template>

<script>
import MediaControllerButton from "@/components/media-controller/MediaControllerButton.vue"

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
        icon() {
            return this.mediaController.state.isPlaybackEnabled ? "media-pause" : "media-play"
        },
        disabled() {
            return this.mediaController.isPlaybackFinished()
        },
        title() {
            if (this.disabled) {
                if (this.mediaController.state.playbackMode === "time") {
                    return this.$t("playback.title.disabled.time")
                } else if (this.mediaController.state.playbackMode === "date") {
                    return this.$t("playback.title.disabled.date")
                }
            } else {
                if (this.mediaController.state.isPlaybackEnabled) {
                    return this.$t("playback.title.stop")
                } else {
                    return this.$t("playback.title.start")
                }
            }
            return ""
        }
    },
    methods: {
        handleClick() {
            this.mediaController.togglePlayback()
        }
    }
}
</script>
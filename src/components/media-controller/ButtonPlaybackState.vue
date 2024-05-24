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
import { useI18n } from "vue-i18n";

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
                    return this.$t("playback.title.disabled.time")
                }
                else if (this.mediaController.playbackMode == PlaybackMode.Date) {
                    return this.$t("playback.title.disabled.date")
                }
            }
            else {
                if (this.mediaController.isPlaybackEnabled) {
                    return this.$t("playback.title.stop")
                }
                else {
                    return this.$t("playback.title.start")
                }
            }

            return ""
        }
    },
    setup() {
        const { t } = useI18n();
        return {
            t,
        }
    }
}
</script>
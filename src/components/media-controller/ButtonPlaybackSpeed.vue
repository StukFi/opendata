<template>
    <media-controller-button
        :text="playbackSpeed"
        :title="$t('playback.title.speed')"
        @click="handleClick"
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
        playbackSpeed() {
            return this.mediaController.state.playbackSpeed / 1000.0 + " s"
        }
    },
    methods: {
        handleClick() {
            this.mediaController.toggleSpeed()
        }
    }
};
</script>

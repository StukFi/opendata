<template>
    <div class="media-controller">
        <button-playback-mode
            :media-controller="mediaController"
        />
        <button-playback-state
            :media-controller="mediaController"
        />
        <button-playback-speed
            :media-controller="mediaController"
        />
    </div>
</template>

<script>
import ButtonPlaybackState from "./ButtonPlaybackState"
import ButtonPlaybackMode from "./ButtonPlaybackMode"
import ButtonPlaybackSpeed from "./ButtonPlaybackSpeed"
import MediaController from "@/models/MediaController"

export default {
    name: "MediaController",
    components: {
        ButtonPlaybackState,
        ButtonPlaybackMode,
        ButtonPlaybackSpeed
    },
    data: function () {
        return {
            mediaController: new MediaController()
        }
    }
}
</script>

<style lang="scss">
.media-controller {
    width: 12em;
    height: 3em;
    position: absolute;
    bottom: 3em;
    left: 50%;
    display: none;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.4);
    z-index: $z-index-media-controller;
    padding: 0.25em;
    border-radius: $border-radius-xs;
}

.media-controller:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

@media (min-width: $breakpoint-md) {
    .media-controller {
        display: flex;
    }
}
</style>

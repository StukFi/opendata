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

<style>
.media-controller {
    width: 200px;
    height: 40px;
    position: absolute;
    bottom: 40px;
    left: 50%;
    display: flex;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 1;
    padding: 3px;
    border-radius: 4px;
}

.media-controller:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

@media only screen and (max-width: 500px) {
    .media-controller {
        display: none;
    }
}
</style>

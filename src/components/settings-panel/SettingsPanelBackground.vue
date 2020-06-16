<template>
    <div
        class="settings-panel-background"
        @click="$emit('click')"
    />
</template>

<script>
export default {
    name: "SettingsPanelBackground"
}
</script>

<style>
.settings-panel-background {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>

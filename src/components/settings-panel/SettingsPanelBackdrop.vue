<template>
    <div
        class="settings-panel-backdrop"
        @click="$emit('click')"
    />
</template>

<script>
export default {
    name: "SettingsPanelBackdrop"
}
</script>

<style lang="scss">
.settings-panel-backdrop {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: $z-index-settings-panel-backdrop;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>

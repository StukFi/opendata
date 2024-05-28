<template>
    <div class="info-panel-header opendata-row">
        <span>{{ $t("info.title") }}</span>
        <span
            class="close-button"
            @click="$emit('close')"
        >&times;</span>
    </div>
</template>

<script>
export default {
    name: "InfoPanelHeader",
    emits: ['close']
}
</script>

<style lang="scss" scoped>
.info-panel-header {
    text-transform: uppercase;
    font-size: $font-xl;
    justify-content: left;
    margin-bottom: 1em;
}

.close-button {
    margin-left: auto;
    font-size: $font-lg;
    transform: scale(2);
    height: 2em;
    line-height: 2em;

    &:hover {
        cursor: pointer;
    }
}
</style>
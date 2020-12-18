<template>
    <div class="settings-panel-header opendata-row">
        <span>{{ $t("header") }}</span>
        <span
            class="close-button"
            @click="$emit('close')"
        >&times</span>
    </div>
</template>

<script>
export default {
    name: "SettingsPanelHeader"
}
</script>

<style lang="scss">
.settings-panel-header {
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

<i18n>
{
    "en": {
        "header": "settings"
    },
    "fi": {
        "header": "asetukset"
    }
}
</i18n>

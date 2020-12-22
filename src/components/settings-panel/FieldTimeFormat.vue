<template>
    <settings-panel-section :title="$t('timeFormat')">
        <base-radio-button
            key="24h"
            v-model="settings.timeFormat"
            :model-value="settings.timeFormat"
            own-value="24h"
            :label="$t('timeFormatA')"
            class="radio-button"
        />
        <base-radio-button
            key="12h"
            v-model="settings.timeFormat"
            :model-value="settings.timeFormat"
            own-value="12h"
            :label="$t('timeFormatB')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "./SettingsPanelSection"

export default {
    name: "FieldTimeFormat",
    components: {
        SettingsPanelSection
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    }
}
</script>

<i18n>
{
    "en": {
        "timeFormat": "Time notation",
        "timeFormatA": "24-hour clock",
        "timeFormatB": "12-hour clock"
    },
    "fi": {
        "timeFormat": "Ajan esitysmuoto",
        "timeFormatA": "24 tunnin kello",
        "timeFormatB": "12 tunnin kello"
    }
}
</i18n>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>

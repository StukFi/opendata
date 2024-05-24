<template>
    <settings-panel-section :title="$t('settings.timeFormat')">
        <base-radio-button
            key="24h"
            v-model="settings.timeFormat"
            :model-value="settings.timeFormat"
            own-value="24h"
            :label="$t('settings.timeFormatA')"
            class="radio-button"
        />
        <base-radio-button
            key="12h"
            v-model="settings.timeFormat"
            :model-value="settings.timeFormat"
            own-value="12h"
            :label="$t('settings.timeFormatB')"
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


<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>

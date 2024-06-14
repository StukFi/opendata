<template>
    <settings-panel-section :title="$t('settings.dateFormat')">
        <base-radio-button
            key="fi"
            v-model="settings.dateFormat"
            :model-value="settings.dateFormat"
            own-value="fi"
            :label="$t('settings.dateFormatA')"
            class="radio-button"
        />
        <base-radio-button
            key="iso"
            v-model="settings.dateFormat"
            :model-value="settings.dateFormat"
            own-value="iso"
            :label="$t('settings.dateFormatB')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "@/components/settings-panel/SettingsPanelSection.vue"

export default {
    name: "FieldDateFormat",
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
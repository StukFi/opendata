<template>
    <settings-panel-section :title="$t('settings.language')">
        <base-radio-button
            key="fi"
            v-model="settings.locale"
            :model-value="settings.locale"
            own-value="fi"
            :label="$t('settings.labelFinnish')"
            class="radio-button"
        />
        <base-radio-button
            key="en"
            v-model="settings.locale"
            :model-value="settings.locale"
            own-value="en"
            :label="$t('settings.labelEnglish')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "@/components/settings-panel/SettingsPanelSection.vue"

export default {
    name: "FieldLanguage",
    components: {
        SettingsPanelSection
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    compatConfig: {
    MODE: 3,
    COMPONENT_V_MODEL: false
  },
}
</script>


<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>

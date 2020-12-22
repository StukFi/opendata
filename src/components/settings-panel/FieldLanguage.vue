<template>
    <settings-panel-section :title="$t('language')">
        <base-radio-button
            key="fi"
            v-model="settings.locale"
            :model-value="settings.locale"
            own-value="fi"
            :label="$t('labelFinnish')"
            class="radio-button"
        />
        <base-radio-button
            key="en"
            v-model="settings.locale"
            :model-value="settings.locale"
            own-value="en"
            :label="$t('labelEnglish')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "./SettingsPanelSection"

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
    }
}
</script>

<i18n>
{
    "en": {
        "language": "Language",
        "labelFinnish": "Finnish",
        "labelEnglish": "English"
    },
    "fi": {
        "language": "Kieli",
        "labelFinnish": "suomi",
        "labelEnglish": "englanti"
    }
}
</i18n>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>

<template>
    <settings-panel-section :title="$t('dateFormat')">
        <base-radio-button
            key="fi"
            v-model="settings.dateFormat"
            :model-value="settings.dateFormat"
            own-value="fi"
            :label="$t('dateFormatA')"
            class="radio-button"
        />
        <base-radio-button
            key="iso"
            v-model="settings.dateFormat"
            :model-value="settings.dateFormat"
            own-value="iso"
            :label="$t('dateFormatB')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "./SettingsPanelSection"

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

<i18n>
{
    "en": {
        "dateFormat": "Date format",
        "dateFormatA": "DD.MM.YYYY",
        "dateFormatB": "YYYY-MM-DD"
    },
    "fi": {
        "dateFormat": "Päiväyksen muoto",
        "dateFormatA": "PP.KK.VVVV",
        "dateFormatB": "VVVV-KK-PP"
    }
}
</i18n>


<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>

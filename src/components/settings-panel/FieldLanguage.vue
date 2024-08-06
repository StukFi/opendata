<template>
    <settings-panel-section :title="$t('settings.language')">
        <base-radio-button
            key="fi"
            v-model="localLocale"
            own-value="fi"
            :label="$t('settings.labelFinnish')"
            class="radio-button"
        />
        <base-radio-button
            key="en"
            v-model="localLocale"
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
    data() {
        return {
            localLocale: this.settings.locale
        }
    },
    watch: {
        localLocale(newValue) {
            this.$emit('update-locale', newValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>
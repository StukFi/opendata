<template>
    <settings-panel-section :title="$t('settings.dateFormat')">
        <base-radio-button
            key="fi"
            v-model="localDateFormat"
            own-value="fi"
            :label="$t('settings.dateFormatA')"
            class="radio-button"
        />
        <base-radio-button
            key="iso"
            v-model="localDateFormat"
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
    },
    data() {
        return {
            localDateFormat: this.settings.dateFormat
        }
    },
    watch: {
        localDateFormat(newValue) {
            this.$emit('update-date-format', newValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>
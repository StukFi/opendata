<template>
    <settings-panel-section :title="$t('settings.backgroundMap')">
        <base-radio-button
            key="default"
            v-model="settings.backgroundMap"
            :model-value="settings.backgroundMap"
            own-value="default"
            :label="$t('settings.backgroundMapDefault')"
            class="radio-button"
        />
        <base-radio-button
            v-if="customMapsEnabled"
            key="custom"
            v-model="settings.backgroundMap"
            :model-value="settings.backgroundMap"
            own-value="custom"
            :label="$t('settings.backgroundMapCustom')"
            class="radio-button"
        />
    </settings-panel-section>
</template>

<script>
import SettingsPanelSection from "@/components/settings-panel/SettingsPanelSection.vue"
import { customMapsEnabled } from "@/utils/mapSettings"

export default {
    name: "FieldBackgroundMap",
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
            customMapsEnabled
        }
    }
}
</script>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>
<template>
    <settings-panel-section :title="$t('settings.backgroundMap')">
        <base-radio-button
            key="default"
            v-model="localBackgroundMap"
            own-value="default"
            :label="$t('settings.backgroundMapDefault')"
            class="radio-button"
        />
        <base-radio-button
            key="custom"
            v-model="localBackgroundMap"
            own-value="custom"
            :label="$t('settings.backgroundMapCustom')"
            v-if="customMapsEnabled"
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
            localBackgroundMap: this.settings.backgroundMap,
            customMapsEnabled
        }
    },
    watch: {
        localBackgroundMap(newValue) {
            this.$emit('update-background-map', newValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.radio-button:first-of-type {
    margin-right: 0.5em;
}
</style>
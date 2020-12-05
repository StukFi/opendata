<template>
    <div v-show="isEnabled">
        <settings-panel-backdrop @click="disable" />
        <div class="settings-panel container pt-5 pl-5 pr-5 pb-2">
            <field-language :settings="settings" />
            <field-date-format :settings="settings" />
            <field-time-format :settings="settings" />
            <field-map-legend :settings="settings" />
            <button-close-settings @click="disable" />
            <app-version />
        </div>
    </div>
</template>

<script>
import FieldLanguage from "./FieldLanguage"
import FieldDateFormat from "./FieldDateFormat"
import FieldTimeFormat from "./FieldTimeFormat"
import FieldMapLegend from "./FieldMapLegend"
import ButtonCloseSettings from "./ButtonCloseSettings"
import SettingsPanelBackdrop from "./SettingsPanelBackdrop"
import AppVersion from "./AppVersion"
import Settings from "@/models/Settings"
import cloneDeep from "lodash/cloneDeep"

export default {
    name: "SettingsPanel",
    components: {
        FieldLanguage,
        FieldDateFormat,
        FieldTimeFormat,
        FieldMapLegend,
        ButtonCloseSettings,
        SettingsPanelBackdrop,
        AppVersion
    },
    data: function () {
        return {
            isEnabled: false,
            settings: new Settings()
        }
    },
    watch: {
        settings: {
            deep: true,
            handler () {
                this.saveSettings()
            }
        }
    },
    mounted () {
        this.$root.$on("settings-panel-open", this.enable)
    },
    methods: {
        enable () {
            this.settings = cloneDeep(this.$store.state.settings.settings)
            this.isEnabled = true
        },
        disable () {
            this.isEnabled = false
            this.saveSettings()
        },
        saveSettings () {
            this.$store.commit("setSettings", cloneDeep(this.settings))
            this.$root.$emit("settingsChanged")
        }
    }
}
</script>

<style lang="scss">
.settings-panel {
    position: fixed;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    height: auto;
    max-height: 70%;
    font-size: $font-lg;
    font-family: $font-medium;
    z-index: $z-index-settings-panel;
    color: $color-font-dark;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: $border-radius-lg;
    overflow-y: hidden;
    padding: 1em;
}
</style>

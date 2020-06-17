<template>
    <div v-show="isEnabled">
        <settings-panel-background @click="disable" />
        <div class="settings-panel container pt-5 pl-5 pr-5 pb-2">
            <field-language />
            <field-date-format />
            <field-time-format />
            <field-map-legend />
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
import SettingsPanelBackground from "./SettingsPanelBackground"
import AppVersion from "./AppVersion"

export default {
    name: "SettingsPanel",
    components: {
        FieldLanguage,
        FieldDateFormat,
        FieldTimeFormat,
        FieldMapLegend,
        ButtonCloseSettings,
        SettingsPanelBackground,
        AppVersion
    },
    data: function () {
        return {
            isEnabled: false
        }
    },
    mounted () {
        this.$root.$on("settings-panel-open", this.enable)
    },
    methods: {
        enable () {
            this.isEnabled = true
        },
        disable () {
            this.isEnabled = false
            this.$store.commit("saveDoseRateRanges")
            this.$root.$emit("settingsChanged")
        }
    }
}
</script>

<style>
.settings-panel {
    position: fixed;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    height: auto;
    max-height: 70%;
    z-index: 5;
    background-color: white;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    overflow-y: scroll;
}
</style>

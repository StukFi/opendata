<template>
    <div>
        <button-open-settings @click="enable" />
        <settings-panel-background
            v-show="isEnabled"
            @click="disable"
        />
        <div
            v-show="isEnabled"
            class="settings-panel container pt-5 pl-5 pr-5 pb-2"
        >
            <field-language />
            <field-date-format />
            <field-time-format />
            <field-map-legend />
            <button-close-settings @click="disable" />
            <field-app-version />
        </div>
    </div>
</template>

<script>
import FieldAppVersion from "./FieldAppVersion"
import FieldLanguage from "./FieldLanguage"
import FieldDateFormat from "./FieldDateFormat"
import FieldTimeFormat from "./FieldTimeFormat"
import FieldMapLegend from "./FieldMapLegend"
import ButtonOpenSettings from "./ButtonOpenSettings"
import ButtonCloseSettings from "./ButtonCloseSettings"
import SettingsPanelBackground from "./SettingsPanelBackground"

export default {
    name: "SettingsPanel",
    components: {
        FieldAppVersion,
        FieldLanguage,
        FieldDateFormat,
        FieldTimeFormat,
        FieldMapLegend,
        ButtonOpenSettings,
        ButtonCloseSettings,
        SettingsPanelBackground
    },
    data: function () {
        return {
            isEnabled: false
        }
    },
    methods: {
        enable () {
            this.isEnabled = true
            console.log("LOL")
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

<template>
    <div class="settings">
        <div
            class="settings-button"
            @click="enable()">
            <span class="settings-button__icon"/>
        </div>
        <div
            v-show="isEnabled"
            class="settings-panel__background"
            @click="disable()"/>
        <div
            v-show="isEnabled"
            class="settings-panel container p-5">
            <div class="row">
                <div class="col">
                    <b-form-group
                        :label="$t('language')"
                        class="mb-5">
                        <b-form-radio-group v-model="locale">
                            <b-form-radio value="fi">FI</b-form-radio>
                            <b-form-radio value="en">EN</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                    <b-form-group
                        :label="$t('dateFormat')"
                        class="mb-5">
                        <b-form-radio-group v-model="dateFormat">
                            <b-form-radio value="fi">{{ $t("dateFormatA") }}</b-form-radio>
                            <b-form-radio value="iso">{{ $t("dateFormatB") }}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                    <b-form-group
                        :label="$t('timeFormat')"
                        class="mb-5">
                        <b-form-radio-group v-model="timeFormat">
                            <b-form-radio value="24h">{{ $t("timeFormatA") }}</b-form-radio>
                            <b-form-radio value="12h">{{ $t("timeFormatB") }}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                    <b-form-group
                        :label="$t('doseRateThresholds')"
                        class="mb-5">
                        <b-input-group>
                            <b-form-input
                                v-for="(item, i) in $store.state.settings.doseRateRanges"
                                :key="i"
                                v-model="item.minValue"
                                class="settings-panel__dose-rate-threshold"
                                type="number"/>
                        </b-input-group>
                    </b-form-group>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-6">
                    <b-button
                        variant="secondary"
                        class="settings-panel__close-button btn-block"
                        @click="disable()">{{ $t("closeButton") }}</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bButton from "bootstrap-vue/es/components/button/button"
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group"
import bFormInput from "bootstrap-vue/es/components/form-input/form-input"
import bFormRadio from "bootstrap-vue/es/components/form-radio/form-radio"
import bFormRadioGroup from "bootstrap-vue/es/components/form-radio/form-radio-group"
import bInputGroup from "bootstrap-vue/es/components/input-group/input-group"

export default {
    name: "Settings",
    components: {
        bButton,
        bFormGroup,
        bFormInput,
        bFormRadio,
        bFormRadioGroup,
        bInputGroup
    },
    data: function () {
        return {
            isEnabled: false
        }
    },
    computed: {
        locale: {
            get () {
                return this.$i18n.locale
            },
            set (locale) {
                this.$store.commit("setLocale", locale)
            }
        },
        dateFormat: {
            get () {
                return this.$store.state.settings.dateFormat
            },
            set (dateFormat) {
                this.$store.commit("setDateFormat", dateFormat)
            }
        },
        timeFormat: {
            get () {
                return this.$store.state.settings.timeFormat
            },
            set (timeFormat) {
                this.$store.commit("setTimeFormat", timeFormat)
            }
        }
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
.settings-button {
    position: absolute;
    bottom: 40px;
    left: 15px;
    width: 45px;
    height: 45px;
    z-index: 1;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
}

.settings-button:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.settings-button__icon {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background-image: url("../../assets/icons/cog.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 50, 136, 0.5);
    background-size: 50%;
}

.settings-button__icon:hover {
    background-color: rgba(0, 50, 136, 0.7);
}

.settings-panel__background {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.5);
}

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

.settings-panel__dose-rate-threshold {
    text-align: center;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
    -moz-appearance:textfield;
}

@media only screen and (min-width: 768px) {
    .settings-button {
        top: 100px;
    }
}
</style>

<i18n>
{
    "en": {
        "language": "Language",
        "dateFormat": "Date format",
        "dateFormatA": "DD.MM.YYYY",
        "dateFormatB": "YYYY-MM-DD",
        "timeFormat": "Time notation",
        "timeFormatA": "24-hour clock",
        "timeFormatB": "12-hour clock",
        "doseRateThresholds": "Dose rate thresholds",
        "closeButton": "Close"
    },
    "fi": {
        "language": "Kieli",
        "dateFormat": "Päiväyksen muoto",
        "dateFormatA": "PP.KK.VVVV",
        "dateFormatB": "VVVV-KK-PP",
        "timeFormat": "Ajan esitysmuoto",
        "timeFormatA": "24 tunnin kello",
        "timeFormatB": "12 tunnin kello",
        "doseRateThresholds": "Annosnopeusrajat",
        "closeButton": "Sulje"
    }
}
</i18n>

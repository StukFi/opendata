<template>
    <b-form-group
        :label="$t('doseRateThresholds')"
        class="mb-5"
    >
        <b-input-group>
            <b-form-input
                v-for="(item, i) in $store.state.settings.doseRateRanges"
                :key="i"
                v-model="item.minValue"
                class="settings-panel__dose-rate-threshold"
                type="number"
                step="any"
            />
        </b-input-group>
    </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue"
import { BFormInput } from "bootstrap-vue"
import { BInputGroup } from "bootstrap-vue"

export default {
    name: "FieldMapLegend",
    components: {
        BFormGroup,
        BFormInput,
        BInputGroup
    }
}
</script>

<style scoped>
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

</style>

<i18n>
{
    "en": {
        "doseRateThresholds": "Dose rate thresholds"
    },
    "fi": {
        "doseRateThresholds": "Annosnopeusrajat"
    }
}
</i18n>

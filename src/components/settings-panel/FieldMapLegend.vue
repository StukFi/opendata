<template>
    <b-form-group
        :label="$t('settings.doseRateThresholds')"
        class="mb-5"
    >
        <b-input-group>
            <b-form-input
                v-for="(bar, i) in settings.mapLegend.bars"
                :key="i"
                v-model="bar.threshold"
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
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
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
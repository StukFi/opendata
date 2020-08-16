<template>
    <b-form-group
        :label="$t('timeFormat')"
        class="mb-5"
    >
        <b-form-radio-group v-model="settings.timeFormat">
            <b-form-radio value="24h">
                {{ $t("timeFormatA") }}
            </b-form-radio>
            <b-form-radio value="12h">
                {{ $t("timeFormatB") }}
            </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue"
import { BFormRadio } from "bootstrap-vue"
import { BFormRadioGroup } from "bootstrap-vue"

export default {
    name: "FieldTimeFormat",
    components: {
        BFormGroup,
        BFormRadio,
        BFormRadioGroup
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    }
}
</script>

<i18n>
{
    "en": {
        "timeFormat": "Time notation",
        "timeFormatA": "24-hour clock",
        "timeFormatB": "12-hour clock"
    },
    "fi": {
        "timeFormat": "Ajan esitysmuoto",
        "timeFormatA": "24 tunnin kello",
        "timeFormatB": "12 tunnin kello"
    }
}
</i18n>

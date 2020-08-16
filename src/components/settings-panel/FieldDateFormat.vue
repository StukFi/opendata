<template>
    <b-form-group
        :label="$t('dateFormat')"
        class="mb-5"
    >
        <b-form-radio-group v-model="settings.dateFormat">
            <b-form-radio value="fi">
                {{ $t("dateFormatA") }}
            </b-form-radio>
            <b-form-radio value="iso">
                {{ $t("dateFormatB") }}
            </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue"
import { BFormRadio } from "bootstrap-vue"
import { BFormRadioGroup } from "bootstrap-vue"

export default {
    name: "FieldDateFormat",
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
        "dateFormat": "Date format",
        "dateFormatA": "DD.MM.YYYY",
        "dateFormatB": "YYYY-MM-DD"
    },
    "fi": {
        "dateFormat": "Päiväyksen muoto",
        "dateFormatA": "PP.KK.VVVV",
        "dateFormatB": "VVVV-KK-PP"
    }
}
</i18n>

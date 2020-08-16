<template>
    <b-form-group
        :label="$t('language')"
        class="mb-5"
    >
        <b-form-radio-group v-model="settings.locale">
            <b-form-radio value="fi">
                FI
            </b-form-radio>
            <b-form-radio value="en">
                EN
            </b-form-radio>
        </b-form-radio-group>
    </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue"
import { BFormRadio } from "bootstrap-vue"
import { BFormRadioGroup } from "bootstrap-vue"

export default {
    name: "FieldLanguage",
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
        "language": "Language"
    },
    "fi": {
        "language": "Kieli"
    }
}
</i18n>

<template>
    <div class="row justify-content-center">
        <div class="col-6">
            <b-button
                variant="secondary"
                class="button-close-settings btn-block"
                @click="$emit('click')"
            >
                {{ $t("closeButton") }}
            </b-button>
        </div>
    </div>
</template>

<script>
import { BButton } from "bootstrap-vue"

export default {
    name: "ButtonCloseSettings",
    components: {
        BButton
    }
}
</script>

<i18n>
{
    "en": {
        "closeButton": "Close"
    },
    "fi": {
        "closeButton": "Sulje"
    }
}
</i18n>

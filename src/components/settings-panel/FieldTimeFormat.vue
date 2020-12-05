<template>
    <div>
        <p>{{ $t("timeFormat")}}</p>
        <fieldset v-model="settings.timeFormat">
            <label>{{ $t("timeFormatA") }}</label>
            <input type="radio" value="24h" v-model="settings.timeFormat">
            <label>{{ $t("timeFormatB") }}</label>
            <input type="radio" value="12h" v-model="settings.timeFormat">
        </fieldset>
    </div>
</template>

<script>
export default {
    name: "FieldTimeFormat",
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

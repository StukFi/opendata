<template>
    <div
        class="datepicker-button opendata-row"
        @click="openCalendar"
    >
        {{ selectedDate }}
    </div>
</template>

<script>
export default {
    name: "ButtonDatepicker",
    computed: {
        selectedDate () {
            const date = this.$store.state.datetime.selectedDate
            if (!date) {
                return
            }

            switch (this.$store.state.settings.settings.dateFormat) {
            case "fi":
            default:
                return date.getDate() + "." + (date.getMonth() + 1) +
                            "." + date.getFullYear()

            case "iso":
                return date.getFullYear() + "-" + (date.getMonth() + 1) +
                            "-" + date.getDate()
            }
        }
    },
    methods: {
        openCalendar () {
            this.$root.$emit("calendar-popup-open")
        }
    }
}
</script>

<style lang="scss">
.datepicker-button {
    flex-basis: 50%;
    flex-grow: 1;
    z-index: $z-index-timepicker;
    border: none;
    background-color: $color-header-date;
    color: white;
    text-align: center;
    font-size: $font-lg;
    font-family: $font-medium;
    border: none;
    outline: none;
    justify-content: center;
}

.datepicker-button:hover {
    cursor: pointer;
}
</style>

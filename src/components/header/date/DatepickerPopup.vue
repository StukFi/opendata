<template>
    <div v-show="isEnabled">
        <base-backdrop @click="close" />
        <vue-datepicker
            v-model="date"
            :use-utc="true"
            :monday-first="true"
            :disabled-dates="disabledDates"
            :format="formatDate"
            :language="language"
            :inline="true"
            class="datepicker"
            calendar-class="calendar"
            @selected="close"
        />
    </div>
</template>

<script>
import VueDatepicker from "vuejs-datepicker"
import BaseBackdrop from "@/components/base/BaseBackdrop"
import { en, fi } from "vuejs-datepicker/dist/locale"

export default {
    name: "DatepickerPopup",
    components: {
        VueDatepicker,
        BaseBackdrop
    },
    data: function () {
        return {
            isEnabled: false,
            en: en,
            fi: fi
        }
    },
    computed: {
        date: {
            get () {
                return this.$store.state.datetime.selectedDate
            },
            set (date) {
                this.$store.dispatch("setDate", date)
            }
        },
        language: {
            get () {
                switch (this.$store.state.settings.settings.locale) {
                case "en":
                default:
                    return this.en

                case "fi":
                    return this.fi
                }
            }
        },
        disabledDates () {
            var availableDatasets = this.$store.state.datetime.availableDatasets
            var disabledDates = {
                ranges: [],
                dates: []
            }

            if (availableDatasets.length == 0) {
                return disabledDates
            }

            // Disable dates from the start of Unix time to the first valid date.
            var firstValidDate = availableDatasets[0].date
            var datesBeforeFirstValidDate = {
                from: new Date(0),
                to: new Date(firstValidDate)
            }
            disabledDates.ranges.push(datesBeforeFirstValidDate)

            // Disable dates from the next ten years after the last valid date.
            var lastValidDate = availableDatasets.slice(-1)[0].date
            var datesAfterLastValidDate = {
                from: lastValidDate,
                to: new Date(lastValidDate.getFullYear() + 10, lastValidDate.getMonth(),
                    lastValidDate.getDate())
            }
            disabledDates.ranges.push(datesAfterLastValidDate)

            // Disable dates in between the valid dates.
            var currentDate = new Date(firstValidDate)
            function dateExists (datetime) {
                return datetime.date.toDateString() == currentDate.toDateString()
            }
            while (currentDate < lastValidDate) {
                if (!availableDatasets.some(dateExists)) {
                    disabledDates.dates.push(new Date(currentDate))
                }

                currentDate.setDate(currentDate.getDate() + 1)
            }

            return disabledDates

        },
    },
    mounted () {
        this.$root.$on("calendar-popup-open", this.open)
    },
    methods: {
        formatDate (date) {
            switch (this.$store.state.settings.settings.dateFormat) {
            case "fi":
            default:
                return date.getDate() + "." + (date.getMonth() + 1) +
                            "." + date.getFullYear()

            case "iso":
                return date.getFullYear() + "-" + (date.getMonth() + 1) +
                            "-" + date.getDate()
            }
        },
        open () {
            this.isEnabled = true
        },
        close () {
            this.isEnabled = false
        }
    }
}
</script>

<style lang="scss">
.datepicker {
    flex-basis: 50%;
    flex-grow: 1;
}

.vdp-datepicker input {
    width: 100%;
    height: 4em;
    font-size: $font-lg;
    font-family: $font-medium;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: $color-header-date;

    /* Hide the input's caret. */
    color: transparent;
    text-shadow: 0 0 0 white;
}

.vdp-datepicker input::selection {
    background-color: transparent;
}

.vdp-datepicker input::-moz-selection {
    background-color: transparent;
}

.vdp-datepicker__calendar.calendar {
    position: fixed !important;
    top: 6.5em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 25em;
    height: auto;
    border-radius: $border-radius-md;
    font-family: $font-medium !important;
    font-size: $font-lg !important;
    padding: 1em;
    z-index: $z-index-calendar-popup;

    .cell {
        height: 3em;
        line-height: 3em;
    }
}
</style>

<template>
    <vue-datepicker
        v-model="date"
        :use-utc="true"
        :monday-first="true"
        :disabled-dates="disabledDates"
        :format="formatDate"
        :language="language"
        class="datepicker"
    />
</template>

<script>
import VueDatepicker from "vuejs-datepicker"
import { en, fi } from "vuejs-datepicker/dist/locale"

export default {
    name: "Datepicker",
    components: {
        VueDatepicker
    },
    data: function () {
        return {
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
        }
    }
}
</script>

<style>
.datepicker {
    flex-basis: 50%;
    flex-grow: 1;
}

.vdp-datepicker input {
    width: 100%;
    height: 60px;
    font-size: 1.7rem;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: #1773B9;

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

.vdp-datepicker__calendar {
    position: fixed !important;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
}

@media only screen and (min-width: 768px) {
    .vdp-datepicker input {
        height: 75px;
        line-height: 75px;
        font-size: 2.3rem;
    }

    .vdp-datepicker__calendar {
        top: 85px;
    }
}
</style>

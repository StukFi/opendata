<template>
    <datepicker v-model="date" :monday-first="true" :disabledDates="disabledDates"></datepicker>
</template>

<script>
import Datepicker from "vuejs-datepicker";

export default {
    name: "DatepickerWidget",
    components: {
        Datepicker
    },
    computed: {
        date: {
            get() {
                return this.$store.state.date;
            },
            set(newValue) {
                this.$store.dispatch("setDate", newValue);
            }
        },
        disabledDates() {
            return this.parseDisabledDates();
        }
    },
    methods: {
        parseDisabledDates() {
            var validDatetimes = this.$store.state.validDatetimes;
            var disabledDates = {
                ranges: [],
                dates: []
            };

            if (validDatetimes.length == 0) {
                return disabledDates;
            }

            for (var i = 0; i < validDatetimes.length; ++i) {
                validDatetimes[i].date = new Date(validDatetimes[i].date);
            }

            // Disable dates from the start of Unix time to the first valid date.
            var firstValidDate = validDatetimes[0].date;
            var datesBeforeFirstValidDate = {
                from: new Date(0),
                to: new Date(firstValidDate)
            };
            disabledDates.ranges.push(datesBeforeFirstValidDate);

            // Disable dates from the next ten years after the last valid date.
            var lastValidDate = validDatetimes.slice(-1)[0].date;
            var datesAfterLastValidDate = {
                from: lastValidDate,
                to: new Date(lastValidDate.getFullYear() + 10, lastValidDate.getMonth(),
                    lastValidDate.getDate())
            }
            disabledDates.ranges.push(datesAfterLastValidDate);

            // Disable dates in between the valid dates.
            var currentDate = new Date(firstValidDate);
            function dateExists(datetime) {
                return datetime.date.getTime() == currentDate.getTime();
            }
            while (currentDate < lastValidDate) {
                if (!validDatetimes.some(dateExists)) {
                    disabledDates.dates.push(new Date(currentDate));
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            return disabledDates;
        }
    }
}
</script>

<style>
.vdp-datepicker {
    position: absolute;
    top: 10px;
    left: 50%;
    z-index: 10000;
    transform: translateX(-50%);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.vdp-datepicker input {
    width: 300px;
    height: 60px;
    line-height: 60px;
    font-size: 1.75em;
    text-align: center;
    border: 1px solid black;
    outline: none;
    cursor: pointer;
    background-color: white;

    /* Hide the input's caret. */
    color: transparent;
    text-shadow: 0 0 0 black;
}

.vdp-datepicker__calendar {
    width: 300px;
    left: 50%;
    transform: translateX(-50%);
}
</style>

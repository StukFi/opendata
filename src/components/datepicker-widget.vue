<template>
    <datepicker v-model="selectedDate" @selected="onDateChanged" :monday-first="true" :disabledDates="disabledDates" :highlighted="highlightedDates"></datepicker>
</template>

<script>
import Datepicker from "vuejs-datepicker";

export default {
    name: "DatepickerWidget",
    components: {
        Datepicker
    },
    data: function() {
        return {
            selectedDate: new Date(),
            validDatetimes: [],
            disabledDates: {
                ranges: [],
                dates: []
            },
            highlightedDates: {
                dates: []
            }
        };
    },
    mounted() {
        var that = this;
        this.$http.get("data/dose_rates/metadata.json").then(function(response) {
            that.parseValidDatetimes(response.body.available_data);
            that.parseDisabledDates();
            that.parseHighlightedDates();

            that.setDate(that.validDatetimes.slice(-1)[0].date);
        });
    },
    methods: {
        parseValidDatetimes(data) {
            for (var i = 0; i < data.length; ++i) {
                data[i].date = new Date(data[i].date);
            }

            data.sort(function(datetimeA, datetimeB) {
                if (datetimeA.date < datetimeB.date) {
                    return -1;
                }

                if (datetimeA.date > datetimeB.date) {
                    return 1;
                }

                return 0;
            });

            this.validDatetimes = data;
        },
        parseDisabledDates() {
            // Disable dates from the start of Unix time to the first valid date.
            var firstValidDate = this.validDatetimes[0].date;
            var datesBeforeFirstValidDate = {
                from: new Date(0),
                to: new Date(firstValidDate)
            };
            this.disabledDates.ranges.push(datesBeforeFirstValidDate);

            // Disable dates from the next ten years after the last valid date.
            var lastValidDate = this.validDatetimes.slice(-1)[0].date;
            var datesAfterLastValidDate = {
                from: lastValidDate,
                to: new Date(lastValidDate.getFullYear() + 10, lastValidDate.getMonth(),
                    lastValidDate.getDate())
            }
            this.disabledDates.ranges.push(datesAfterLastValidDate);

            // Disable dates in between the valid dates.
            var currentDate = new Date(firstValidDate);
            function dateExists(datetime) {
                return datetime.date.getTime() == currentDate.getTime();
            }
            while (currentDate < lastValidDate) {
                if (!this.validDatetimes.some(dateExists)) {
                    this.disabledDates.dates.push(new Date(currentDate));
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        },
        parseHighlightedDates() {
            var firstValidDate = this.validDatetimes[0].date;
            var lastValidDate = this.validDatetimes.slice(-1)[0].date;
            this.highlightedDates.dates.push(firstValidDate, lastValidDate);
        },
        setDate(date) {
            this.selectedDate = date;
            this.onDateChanged();
        },
        onDateChanged() {
            this.$root.$emit("dateChanged", this.selectedDate);

            for (var i = 0; i < this.validDatetimes.length; ++i) {
                if (this.validDatetimes[i].date.getTime() == this.selectedDate.getTime()) {
                    this.$root.$emit("validTimesChanged", this.validDatetimes[i].times);
                    break;
                }
            }
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
    background-color: rgba(204, 229, 236, 1);

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

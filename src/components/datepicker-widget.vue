<template>
    <div class="datepicker-container">
        <button class="button__change-date button__decrement-date" @click="decrementDate()"></button>
        <button class="button__change-date button__increment-date" @click="incrementDate()"></button>
        <datepicker v-model="date" :monday-first="true" :disabledDates="disabledDates" :format="dateFormatter"></datepicker>
    </div>
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
                return this.$store.state.datetime.date;
            },
            set(newDate) {
                this.$store.dispatch("setDate", newDate);
            }
        },
        disabledDates() {
            return this.parseDisabledDates();
        }
    },
    methods: {
        dateFormatter(date) {
            return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        },
        parseDisabledDates() {
            var validDatetimes = this.$store.state.datetime.validDatetimes;
            var disabledDates = {
                ranges: [],
                dates: []
            };

            if (validDatetimes.length == 0) {
                return disabledDates;
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
                return datetime.date.toDateString() == currentDate.toDateString();
            }
            while (currentDate < lastValidDate) {
                if (!validDatetimes.some(dateExists)) {
                    disabledDates.dates.push(new Date(currentDate));
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            return disabledDates;
        },
        decrementDate() {
            this.$store.dispatch("decrementDate");
        },
        incrementDate() {
            this.$store.dispatch("incrementDate");
        }
    }
}
</script>

<style>
.datepicker-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 75px;
    z-index: 10000;
}

.datepicker-container input {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 1.7em;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: #C7EAE4;

    /* Hide the input's caret. */
    color: transparent;
    text-shadow: 0 0 0 black;
}

/* This and the following duplicate block cannot be
   combined. The browser will skip the entire block
   if it doesn't recognize one of the selectors. */
.vdp-datepicker input::selection {
    background-color: transparent;
}

.vdp-datepicker input::-moz-selection {
    background-color: transparent;
}

.vdp-datepicker__calendar {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
}

.button__change-date {
    width: 25%;
    height: 100%;
    position: absolute;
    border: none;
    background-color: #C7EAE4;
    background-size: 1.5em;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
    z-index: 1;
}

.button__decrement-date {
    left: 0;
    background-image: url("../../assets/icons/caret-left.svg");
}

.button__increment-date {
    right: 0;
    background-image: url("../../assets/icons/caret-right.svg");
}

@media only screen and (min-width: 768px) {
    .vdp-datepicker input {
        height: 75px;
        line-height: 75px;
        font-size: 2.3em;
    }

    .vdp-datepicker__calendar {
        top: 85px;
    }
}
</style>

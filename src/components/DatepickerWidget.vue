<template>
    <div class="datepicker-container">
        <button class="button__change-date button__decrement-date" @click="decrementDate()" :class="{'button__change-date--disabled': isFirstDateSelected}"></button>
        <button class="button__change-date button__increment-date" @click="incrementDate()" :class="{'button__change-date--disabled': isLastDateSelected}"></button>
        <datepicker v-model="date" :use-utc="true" :monday-first="true" :disabledDates="disabledDates" :format="dateFormatter" :language="language"></datepicker>
    </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import {en, fi} from "vuejs-datepicker/dist/locale"

export default {
    name: "DatepickerWidget",
    components: {
        Datepicker
    },
    data: function() {
        return {
            en: en,
            fi: fi
        }
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
        language: {
            get() {
                switch (this.$store.state.settings.locale)
                {
                    case "en":
                    default:
                        return this.en;
                        break;

                    case "fi":
                        return this.fi;
                        break;
                }
            }
        },
        disabledDates() {
            return this.parseDisabledDates();
        },
        isFirstDateSelected() {
            return this.$store.getters.isFirstDateSelected;
        },
        isLastDateSelected() {
            return this.$store.getters.isLastDateSelected;
        }
    },
    methods: {
        dateFormatter(date) {
            switch (this.$store.state.settings.dateFormat)
            {
                case "fi":
                default:
                    return date.getDate() + "." + (date.getMonth() + 1) + 
                            "." + date.getFullYear();
                    break;
                
                case "iso":
                    return date.getFullYear() + "-" + (date.getMonth() + 1) +
                            "-" + date.getDate();
                    break;
            }
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
    height: 60px;
    z-index: 3;
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
    background-color: #0066b3;

    /* Hide the input's caret. */
    color: transparent;
    text-shadow: 0 0 0 white;
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
    background-color: #0066b3;
    background-size: 15%;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
    z-index: 1;
}

.button__change-date:focus {
    outline: none;
}

.button__decrement-date {
    left: 0;
    background-image: url("../../assets/icons/caret-left.svg");
}

.button__increment-date {
    right: 0;
    background-image: url("../../assets/icons/caret-right.svg");
}

.button__change-date--disabled {
    background-image: none;
}

@media only screen and (max-width: 500px) {
    .button__change-date {
        display: none;
    }
}

@media only screen and (min-width: 768px) {
    .vdp-datepicker input {
        height: 75px;
        line-height: 75px;
        font-size: 2.3em;
    }

    .datepicker-container {
        height: 75px;
    }

    .vdp-datepicker__calendar {
        top: 85px;
    }
}
</style>
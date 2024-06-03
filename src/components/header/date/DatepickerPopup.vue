<template>
    <div v-show="isEnabled">
        <base-backdrop @click="close" />
        <datepicker
            ref="datepicker"
            v-model="date"
            :monday-first="true"
            :disabled-dates="disabledDates"
            :format="formatDate"
            :inline="true"
            class="datepicker"
            calendar-class="calendar"
            @selected="close"
            @click="handleDateSelected"
            />
    </div>
</template>

<script>
import Datepicker from "vuejs3-datepicker"
import BaseBackdrop from "@/components/base/BaseBackdrop"
import eventBus from '@/utils/eventBus'

export default {
    name: "DatepickerPopup",
    components: {
        Datepicker,
        BaseBackdrop
    },
    data() {
        return {
            isEnabled: false,
        }
    },
    computed: {
        date: {
            get() {
                return this.$store.state.datetime.selectedDate
            },
            set(date) {
                    this.$store.dispatch("setDate", date);
            }
        },
        disabledDates() {
            const availableDatasets = this.$store.state.datetime.availableDatasets;
            const disabledDates = { to: null, from: null, dates: [] };

            if (availableDatasets.length === 0) {
                return disabledDates;
            }

            // Get first and last valid dates
            const firstValidDate = new Date(availableDatasets[0].date);
            const lastValidDate = new Date(availableDatasets[availableDatasets.length - 1].date);

            // Disable dates before the first valid date
            disabledDates.to = new Date(firstValidDate.getTime() - 1);

            // Disable dates after the last valid date
            disabledDates.from = new Date(lastValidDate.getTime() + 1);

            // Disable dates in between the valid dates
            let currentDate = new Date(firstValidDate);
            while (currentDate <= lastValidDate) {
                if (!availableDatasets.some(dataset => new Date(dataset.date).toDateString() === currentDate.toDateString())) {
                    disabledDates.dates.push(new Date(currentDate));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return disabledDates;
        },
    },
    watch: {
        '$store.state.settings.settings.locale': function(newLocale) {
            this.updateLocale(newLocale);
        }
    },
    mounted() {
        eventBus.$on("calendar-popup-open", this.open)
        this.updateLocale(this.$store.state.settings.settings.locale);
    },
    methods: {
        handleDateSelected() {
            this.updateLocale(this.$store.state.settings.settings.locale);
        },
        updateLocale(locale) {
            if (locale === 'fi') {
                const fiLocaleData = this.fiLocale();
                this.updateDayHeaders(fiLocaleData.days);
                this.updateMonthHeaders(fiLocaleData.months);
                this.updateHeaderMonthYear(fiLocaleData.months);
            } else {
                this.resetDayHeaders();
                this.resetMonthHeaders();
                this.resetHeaderMonthYear();
            }
        },
        fiLocale() {
            return {
                months: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
                days: ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']
            };
        },
        updateDayHeaders(days) {
            this.$nextTick(() => {
                const dayHeaders = this.$refs.datepicker.$el.querySelectorAll('.cell.day-header');
                dayHeaders.forEach((header, index) => {
                    header.textContent = days[index];
                });
            });
        },
        resetDayHeaders() {
            const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            this.updateDayHeaders(defaultDays);
        },
        updateMonthHeaders(months) {
            this.$nextTick(() => {
                const monthHeaders = this.$refs.datepicker.$el.querySelectorAll('.cell.month');
                monthHeaders.forEach((header, index) => {
                    header.textContent = months[index];
                });
            });
        },
        resetMonthHeaders() {
            const defaultMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            this.updateMonthHeaders(defaultMonths);
        },
        updateHeaderMonthYear(months) {
            this.$nextTick(() => {
                const headerMonthYear = this.$refs.datepicker.$el.querySelector('.day__month_btn.up');
                if (headerMonthYear) {
                    const date = new Date(this.date);
                    const month = months[date.getMonth()];
                    const year = date.getFullYear();
                    headerMonthYear.textContent = `${month} ${year}`;
                }
            });
        },
        resetHeaderMonthYear() {
            this.$nextTick(() => {
                const headerMonthYear = this.$refs.datepicker.$el.querySelector('.day__month_btn.up');
                if (headerMonthYear) {
                    const date = new Date(this.date);
                    const defaultMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const month = defaultMonths[date.getMonth()];
                    const year = date.getFullYear();
                    headerMonthYear.textContent = `${month} ${year}`;
                }
            });
        },
        formatDate(date) {
            switch (this.$store.state.settings.settings.dateFormat) {
                case "fi":
                default:
                    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear()
                case "iso":
                    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            }
        },
        open() {
            this.isEnabled = true;
            this.updateLocale(this.$store.state.settings.settings.locale);
        },
        close() {
            this.isEnabled = false
        }
    }
}
</script>

<style lang="scss">
.vuejs3-datepicker input {
    width: 100%;
    height: 4em;
    font-size: $font-lg;
    font-family: $font-medium;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: $color-header-date;

    color: transparent;
    text-shadow: 0 0 0 white;
}

.vuejs3-datepicker input::selection {
    background-color: transparent;
}

.vuejs3-datepicker input::-moz-selection {
    background-color: transparent;
}

.vuejs3-datepicker {
    display: block;
}

.vuejs3-datepicker__calendar.header {
    font-size: 1em;
}

.vuejs3-datepicker__calendar-topbar {
    display: none;
}

.vuejs3-datepicker__calendar.calendar {
    overflow-y: hidden;
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
    font-size: 1em;
    padding: 1em;
    z-index: $z-index-calendar-popup;

    .cell {
        height: 3em;
        line-height: 3em;
        font-size: 0.8em;
        text-align: center;
    }

    .cell.selected {
        background-color: $color-header-date;
    }

    .cell:not(.blank):not(.disabled).day:hover,
    .cell:not(.blank):not(.disabled).month:hover,
    .cell:not(.blank):not(.disabled).year:hover {
        border-color: $color-header-date;
    }

    .cell.month,
    .cell.year {
        padding: 0;
    }
}
</style>
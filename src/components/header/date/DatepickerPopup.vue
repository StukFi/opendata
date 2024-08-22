<template>
    <div v-show="isEnabled">
        <base-backdrop @click="close" />
        <VueDatePicker
            v-model="date"
            :inline="true"
            menu-class-name="dp-custom-menu"
            :locale="language"
            auto-apply
            hide-offset-dates
            :allowed-dates="allowedDates"
            @date-update="close"
        />
    </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import BaseBackdrop from "@/components/base/BaseBackdrop.vue"
import eventBus from "@/utils/eventBus"

export default {
    name: "DatepickerPopup",
    components: {
        VueDatePicker,
        BaseBackdrop
    },
    data: function () {
        return {
            isEnabled: false,
            fi: "fi",
            en: "en"
        }
    },
    computed: {
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
        date: {
            get() {
                return this.$store.state.datetime.selectedDate
            },
            set(date) {
                this.$store.dispatch("setDate", date)
            }
        },
        allowedDates() {
            var availableDatasets = this.$store.state.datetime.availableDatasets
            var allowedDates = []

            if (availableDatasets.length === 0) {
                return allowedDates
            }

            // Add all dates from available datasets to allowedDates array
            availableDatasets.forEach(dataset => {
                allowedDates.push(new Date(dataset.date))
            })

            return allowedDates
        }
    },
    mounted() {
        eventBus.$on("calendar-popup-open", this.open)
    },
    methods: {
        formatDate(date) {
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
        open() {
            this.isEnabled = true
        },
        close() {
            this.isEnabled = false
        }
    }
}
</script>

<style lang="scss">
    .dp-custom-menu {
        position: fixed !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: "RedHatText-Medium" !important;
        font-size: 1.25rem !important;
        border-radius: .75em;
        padding: 1em;
        z-index: $z-index-calendar-popup;
        width: 17em;

    .dp__button {
        display: none;
    }

    .dp__action_row {
        display: none;
    }

    .dp__overlay {
        background: white;
    }

    .dp__cell_inner {
        padding: 1em;
    }

    .dp--header-wrap {
        padding-bottom: 1em;
    }

    .dp__calendar_header {
        font-weight: normal;
    }

    .dp__calendar_header_item {
        height: 2em;
        padding: var(--dp-cell-padding);
    }

}
</style>
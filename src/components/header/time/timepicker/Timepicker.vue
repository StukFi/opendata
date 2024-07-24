<template>
    <div
        class="timepicker"
    >
        <div
            class="timepicker-button opendata-row"
            @click="toggleTimeList"
        >
            {{ formattedTime }}
        </div>
    </div>
</template>

<script>
import dateUtils from "@/utils/date"
import eventBus from '@/utils/eventBus'

export default {
    name: "Timepicker",
    emits: ['timepicker-list-toggle'],
    computed: {
        formattedTime () {
            let time = this.$store.state.datetime.selectedTime
            if (!time) {
                return
            }

            time = time.slice(0, 2) + ":" + time.slice(2, 4)

            switch (this.$store.state.settings.settings.timeFormat) {
            case "12h":
                time = dateUtils.convertTimeTo12HourClock(time)
                return time.split(" ")[0] + "Z " + time.split(" ")[1]

            case "24h":
            default:
                return time + "Z"
            }
        }
    },
    methods: {
        toggleTimeList () {
            eventBus.$emit("timepicker-list-toggle")
        }
    }
}
</script>

<style lang="scss">
.timepicker {
    flex-basis: 50%;
    flex-grow: 1;
    z-index: $z-index-timepicker;
    border: none;
    background-color: $color-header-time;
    color: white;
    text-align: center;
}

.timepicker:hover,
.timepicker-view:hover {
    cursor: pointer;
}

.timepicker-button {
    height: 100%;
    font-size: $font-lg;
    font-family: $font-medium;
    border: none;
    outline: none;
    background-color: transparent;
    justify-content: center;
}
</style>

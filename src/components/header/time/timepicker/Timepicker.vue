<template>
    <div
        class="timepicker"
    >
        <div
            class="timepicker-button"
            @click="toggleTimeList"
        >
            {{ formattedTime }}
        </div>
        <timepicker-list ref="timepickerList" />
    </div>
</template>

<script>
import TimepickerList from "./TimepickerList"
import dateUtils from "@/utils/date"

export default {
    name: "Timepicker",
    components: {
        TimepickerList
    },
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
            this.$refs.timepickerList.toggle()
        }
    }
}
</script>

<style>
.timepicker {
    flex-basis: 50%;
    flex-grow: 1;
    line-height: 60px;
    z-index: 3;
    font-size: 1.7rem;
    text-align: center;
    border: none;
    background-color: #0066b3;
    color: white;
}

.timepicker:hover,
.timepicker-view:hover {
    cursor: pointer;
}

.timepicker-button {
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
}

@media only screen and (min-width: 768px) {
    .timepicker {
        height: 75px;
        line-height: 75px;
        font-size: 2.3rem;
    }
}
</style>

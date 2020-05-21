<template>
    <li
        :class="{'selected': time == selectedTime}"
        @click="selectTime"
    >
        {{ formatTime() }}
    </li>
</template>

<script>
import dateUtils from "@/utils/date"

export default {
    name: "TimepickerListItem",
    props: {
        time: {
            type: String,
            default: ""
        }
    },
    computed: {
        selectedTime () {
            return this.$store.state.datetime.time
        }
    },
    methods: {
        selectTime () {
        },
        formatTime (time, isSelectedTime) {
            if (!time) {
                return ""
            }

            time = time.slice(0, 2) + ":" + time.slice(2, 4)

            switch (this.$store.state.settings.timeFormat) {
            case "12h":
                time = dateUtils.convertTimeTo12HourClock(time)
                return isSelectedTime ? (time.split(" ")[0] + "Z " + time.split(" ")[1]) : time

            case "24h":
            default:
                return isSelectedTime ? (time + "Z") : time
            }
        }
    }
}
</script>

<style>
li {
    list-style-type: none;
    height: 50px;
    line-height: 50px;
    color: black;
}

li.selected {
    background-color: #1773B9;
    color: white;
}
</style>

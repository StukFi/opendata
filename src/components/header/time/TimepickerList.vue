<template>
    <ul
        v-if="isEnabled"
        v-on-clickaway="close"
        class="time-list"
    >
        <timepicker-list-item
            v-for="(timeEntry, index) in validTimesForCurrentDate.slice().reverse()"
            :key="index"
            @click="setTime(timeEntry), toggleTimeList()"
        />
    </ul>
</template>

<script>
import TimepickerListItem from "./TimepickerListItem"
import { mixin as clickaway } from "vue-clickaway"
import dateUtils from "@/utils/date"

export default {
    name: "TimepickerList",
    components: {
        TimepickerListItem
    },
    mixins: [ clickaway ],
    data: function () {
        return {
            isEnabled: false
        }
    },
    computed: {
        time: {
            get () {
                return this.$store.state.datetime.time
            },
            set (time) {
                this.$store.commit("setTime", time)
            }
        },
        validTimesForCurrentDate () {
            return this.$store.getters.validTimesForCurrentDate
        }
    },
    methods: {
        close () {
            this.isEnabled = false
        },
        toggle () {
            this.isEnabled = !this.isEnabled
        },
        setTime (time) {
            this.time = time
        },
        decrementTime () {
            this.$store.dispatch("decrementTime")
        },
        incrementTime () {
            this.$store.dispatch("incrementTime")
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
.timepicker-container {
    flex-basis: 50%;
    line-height: 60px;
    z-index: 3;
    font-size: 1rem;
    text-align: center;
    border: none;
    background-color: #0066b3;
    color: white;
}

.timepicker-container:hover,
.timepicker:hover {
    cursor: pointer;
}

.timepicker {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
}

.time-list {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    width: 300px;
    height: 282px;
    overflow: scroll;
    overflow-x: unset;
    top: 70px;
    margin: 0;
    padding: 0;
    background-color: white;
    border: 1px solid #CCC;
    font-size: 1rem;
}

.time-list__entry {
    list-style-type: none;
    height: 50px;
    line-height: 50px;
    color: black;
}

.time-list__entry--selected {
    background-color: #1773B9;
    color: white;
}

@media only screen and (min-width: 768px) {
    .time-list {
        top: 85px;
    }
}
</style>

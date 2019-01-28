<template>
    <div class="timepicker-container">
        <button
            :class="{'button__change-time--disabled': isFirstTimeSelected}"
            class="button__change-time button__decrement-time"
            @click="decrementTime()"/>
        <button
            :class="{'button__change-time--disabled': isLastTimeSelected}"
            class="button__change-time button__increment-time"
            @click="incrementTime()"/>
        <div
            class="timepicker"
            @click="toggleTimeList">{{ formatTime(time, true) }}</div>
        <ul
            v-show="isTimeListOpen"
            class="time-list">
            <li
                v-for="(timeEntry, index) in validTimesForCurrentDate.slice().reverse()"
                :class="{'time-list__entry--selected': timeEntry == time}"
                :key="index"
                class="time-list__entry"
                @click="setTime(timeEntry), toggleTimeList()">{{ formatTime(timeEntry) }}</li>
        </ul>
    </div>
</template>

<script>
import dateUtils from "../utils/date"

export default {
    name: "TimepickerWidget",
    data: function () {
        return {
            isTimeListOpen: false
        }
    },
    computed: {
        time: {
            get () {
                return this.$store.state.datetime.time
            },
            set (newValue) {
                this.$store.commit("setTime", newValue)
            }
        },
        validTimesForCurrentDate () {
            return this.$store.getters.validTimesForCurrentDate
        },
        isFirstTimeSelected () {
            return this.$store.getters.isFirstTimeSelected
        },
        isLastTimeSelected () {
            return this.$store.getters.isLastTimeSelected
        }
    },
    mounted () {
        var that = this

        // Clicking outside the timelist should close it.
        window.addEventListener("click", function (e) {
            if (e.target.className != "time-list__entry" &&
                e.target.className != "timepicker") {
                that.closeTimeList()
            }
        })
    },
    methods: {
        closeTimeList () {
            this.isTimeListOpen = false
        },
        toggleTimeList () {
            this.isTimeListOpen = !this.isTimeListOpen
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
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 60px;
    line-height: 60px;
    z-index: 3;
    font-size: 1.7em;
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
    height: 300px;
    overflow: scroll;
    overflow-x: unset;
    top: 70px;
    margin-top: 0;
    padding: 0;
    background-color: white;
    border: 1px solid #CCC;
    font-size: 0.8em;
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

.button__change-time {
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
}

.button__change-time:focus {
    outline: none;
}

.button__decrement-time {
    left: 0;
    background-image: url("../../assets/icons/caret-left.svg");
}

.button__increment-time {
    right: 0;
    background-image: url("../../assets/icons/caret-right.svg");
}

.button__change-time--disabled {
    background-image: none;
}

@media only screen and (max-width: 500px) {
    .button__change-time {
        display: none;
    }
}

@media only screen and (min-width: 768px) {
    .timepicker-container {
        height: 75px;
        line-height: 75px;
        font-size: 2.3em;
    }

    .time-list {
        top: 85px;
    }
}
</style>

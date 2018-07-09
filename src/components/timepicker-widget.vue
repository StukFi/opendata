<template>
    <div class="timepicker-container">
        <div class="timepicker" @click="toggleTimeList">{{time | formatTime}}</div>
        <ul class="time-list" v-show="isTimeListOpen">
            <li class="time-list__entry" v-bind:class="{'time-list__entry--selected': timeEntry == time}" @click="setTime(timeEntry), toggleTimeList()" v-for="timeEntry in validTimesForCurrentDate">{{timeEntry | formatTime}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "TimepickerWidget",
    data: function() {
        return {
            isTimeListOpen: false
        };
    },
    computed: {
        time: {
            get() {
                return this.$store.state.datetime.time;
            },
            set(newValue) {
                this.$store.commit("setTime", newValue);
            }
        },
        validTimesForCurrentDate() {
            return this.$store.getters.validTimesForCurrentDate.sort().reverse();
        }
    },
    mounted() {
        var that = this;

        // Clicking outside the timelist should close it.
        window.addEventListener("click", function(e) {
            if (e.target.className != "time-list__entry" &&
                e.target.className != "timepicker") {
                that.closeTimeList();
            }
        });
    },
    methods: {
        closeTimeList() {
            this.isTimeListOpen = false;
        },
        toggleTimeList() {
            this.isTimeListOpen = !this.isTimeListOpen;
        },
        setTime(time) {
            this.time = time;
        }
    },
    filters: {
        formatTime(time) {
            if (!time) {
                return "";
            }

            var hours = time.slice(0, 2);
            var minutes = time.slice(2, 4);
            return hours + ":" + minutes;
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
    z-index: 1000;
    font-size: 1.7em;
    text-align: center;
    border: none;
    background-color: #AADDD5;
    user-select: none;
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
    user-select: none;
}

.time-list {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    width: 300px;
    height: 300px;
    overflow: scroll;
    overflow-x: unset;
    top: 85px;
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
}

.time-list__entry--selected {
    background-color: #4BD;
}

@media only screen and (min-width: 768px) {
    .timepicker-container {
        height: 75px;
        line-height: 75px;
        font-size: 2.3em;
    }
}
</style>

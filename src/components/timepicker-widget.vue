<template>
    <div class="timepicker-container">
        <select class="timepicker" v-model="time">
            <option :value="time" v-for="time in validTimesForCurrentDate">{{time | formatTime}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: "TimepickerWidget",
    computed: {
        time: {
            get() {
                return this.$store.state.time;
            },
            set(newValue) {
                this.$store.commit("setTime", newValue);
            }
        },
        validTimesForCurrentDate() {
            return this.$store.getters.validTimesForCurrentDate.sort().reverse();
        }
    },
    filters: {
        formatTime(time) {
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
    top: 75px;
    left: 50%;
    width: 150px;
    height: 50px;
    z-index: 1000;
    transform: translateX(-50%);
    line-height: 50px;
    font-size: 1.5em;
    text-align: center;
    border: 1px solid black;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    background-color: white;
}

.timepicker-container:hover,
.timepicker:hover {
    cursor: pointer;
}

.timepicker {
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
}
</style>

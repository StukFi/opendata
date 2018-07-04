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

@media only screen and (min-width: 768px) {
    .timepicker-container {
        height: 75px;
        line-height: 75px;
        font-size: 2.3em;
    }
}
</style>

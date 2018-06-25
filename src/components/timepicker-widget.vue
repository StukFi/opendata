<template>
    <div class="timepicker-container">
        <select class="timepicker" v-model="time" @change="onTimeChanged">
            <option :value="time" v-for="time in validTimes">{{time | formatTime}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: "TimepickerWidget",
    data: function() {
        return {
            time: undefined,
            validTimes: [],
        };
    },
    mounted() {
        this.$root.$on("validTimesChanged", this.onValidTimesChanged);
    },
    methods: {
        onValidTimesChanged(times) {
            this.validTimes = times.sort().reverse();

            if (!this.validTimes.includes(this.time)) {
                this.time = this.validTimes[0];
            }
        },
        onTimeChanged() {
            this.$root.$emit("timeChanged", this.time);
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
    background-color: rgba(204, 229, 236, 1);
}

.timepicker {
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
}
</style>

<template>
    <ul
        v-show="isEnabled"
        class="timepicker-list"
    >
        <timepicker-list-item
            v-for="(time, index) in availableTimesForSelectedDate.slice().reverse()"
            :key="index"
            :time="time"
            @click="close()"
        />
    </ul>
</template>

<script>
import TimepickerListItem from "./TimepickerListItem"
import { mixin as clickaway } from "vue-clickaway"

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
        availableTimesForSelectedDate () {
            return this.$store.getters.availableTimesForSelectedDate
        }
    },
    methods: {
        close () {
            this.isEnabled = false
        },
        toggle () {
            this.isEnabled = !this.isEnabled
        }
    }
}
</script>

<style scoped>
.timepicker-list {
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

.timepicker-list:hover {
    cursor: auto;
}

@media only screen and (min-width: 768px) {
    .timepicker-list {
        top: 85px;
    }
}
</style>

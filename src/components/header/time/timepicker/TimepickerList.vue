<template>
    <ul
        v-show="isEnabled"
        class="timepicker-list"
    >
        <div class="list-container">
            <timepicker-list-item
                v-for="(time, index) in availableTimesForSelectedDate.slice().reverse()"
                :key="index"
                :time="time"
                @click="close()"
            />
        </div>
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

<style lang="scss" scoped>
.timepicker-list {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    width: 19em;
    height: auto;
    max-height: 20em;
    overflow: hidden;
    padding: 0.25em;
    top: 6.5em;
    margin: 0;
    background-color: white;
    border: 1px solid #CCC;
    border-radius: $border-radius-md;
    font-family: $font-medium;
    font-size: $font-md;
}

.timepicker-list:hover {
    cursor: auto;
}

.list-container {
    overflow: auto;
    height: auto;
    max-height: 19em;
    padding-right: 0.25em;
}
</style>

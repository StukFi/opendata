<template>
    <ul
        v-if="isEnabled"
        v-on-clickaway="close"
        class="timepicker-list"
    >
        <timepicker-list-item
            v-for="(time, index) in validTimesForCurrentDate.slice().reverse()"
            :key="index"
            :time="time"
            @click="setTime(time), close()"
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
        validTimesForCurrentDate () {
            return this.$store.getters.validTimesForCurrentDate
        }
    },
    methods: {
        setTime (time) {
            this.$store.commit("setTime", time)
        },
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
@media only screen and (min-width: 768px) {
    .timepicker-list {
        top: 85px;
    }
}
</style>

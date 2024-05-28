<template>
    <div
    v-show="isEnabled"
    >
        <base-backdrop @click="close"/>
        <ul
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
    </div>
</template>

<script>
import TimepickerListItem from "./TimepickerListItem"
import BaseBackdrop from "@/components/base/BaseBackdrop"
import eventBus from '@/utils/eventBus'

export default {
    name: "TimepickerList",
    components: {
        TimepickerListItem,
        BaseBackdrop
    },
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
    mounted () {
        eventBus.$on("timepicker-list-toggle", this.toggle)
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
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 25em;
    height: auto;
    max-height: 20em;
    overflow: hidden;
    padding: 0.25em;
    margin: 0;
    background-color: white;
    border: 1px solid #CCC;
    border-radius: $border-radius-md;
    font-family: $font-medium;
    font-size: $font-lg;
    z-index: $z-index-timepicker-list;
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

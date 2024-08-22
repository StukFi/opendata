<template>
    <div class="time-widget">
        <button-decrement-time />
        <timepicker />
        <button-increment-time />
    </div>
</template>

<script>
import ButtonDecrementTime from "@/components/header/time/ButtonDecrementTime.vue"
import ButtonIncrementTime from "@/components/header/time/ButtonIncrementTime.vue"
import Timepicker from "@/components/header/time/timepicker/Timepicker.vue"

export default {
    name: "TimeWidget",
    components: {
        ButtonDecrementTime,
        ButtonIncrementTime,
        Timepicker
    }
}
</script>

<style lang="scss" scoped>
.time-widget {
    display: flex;
    flex-basis: 50%;
}
</style>

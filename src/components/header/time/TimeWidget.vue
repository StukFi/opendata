<template>
    <div class="time-widget">
        <button-decrement-time />
        <timepicker />
        <button-increment-time />
    </div>
</template>

<script>
import ButtonDecrementTime from "@/components/header/time/ButtonDecrementTime"
import ButtonIncrementTime from "@/components/header/time/ButtonIncrementTime"
import Timepicker from "./Timepicker"

export default {
    name: "TimeWidget",
    components: {
        ButtonDecrementTime,
        ButtonIncrementTime,
        Timepicker
    }
}
</script>

<style>
.time-widget {
    display: flex;
    flex-basis: 50%;
}
</style>

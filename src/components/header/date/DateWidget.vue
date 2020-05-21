<template>
    <div class="date-widget">
        <button-decrement-date />
        <datepicker />
        <button-increment-date />
    </div>
</template>

<script>
import ButtonDecrementDate from "@/components/header/date/ButtonDecrementDate"
import ButtonIncrementDate from "@/components/header/date/ButtonIncrementDate"
import Datepicker from "./Datepicker"

export default {
    name: "DateWidget",
    components: {
        ButtonDecrementDate,
        ButtonIncrementDate,
        Datepicker
    }
}
</script>

<style>
.date-widget {
    display: flex;
    flex-basis: 50%;
}
</style>

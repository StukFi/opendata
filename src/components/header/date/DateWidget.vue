<template>
    <div class="date-widget">
        <button-decrement-date />
        <datepicker />
        <button-increment-date />
    </div>
</template>

<script>
import ButtonDecrementDate from "./ButtonDecrementDate"
import ButtonIncrementDate from "./ButtonIncrementDate"
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

<style scoped>
.date-widget {
    display: flex;
    flex-basis: 50%;
}
</style>

<template>
    <div class="date-widget">
        <button-decrement-date />
        <button-datepicker />
        <button-increment-date />
    </div>
</template>

<script>
import ButtonDecrementDate from "./ButtonDecrementDate"
import ButtonIncrementDate from "./ButtonIncrementDate"
import ButtonDatepicker from "./ButtonDatepicker"

export default {
    name: "DateWidget",
    components: {
        ButtonDecrementDate,
        ButtonIncrementDate,
        ButtonDatepicker
    }
}
</script>

<style scoped>
.date-widget {
    display: flex;
    flex-basis: 50%;
}
</style>

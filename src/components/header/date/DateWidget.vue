<template>
    <div class="date-widget">
        <button-decrement-date />
        <button-datepicker />
        <button-increment-date />
    </div>
</template>

<script>
import ButtonDecrementDate from "@/components/header/date/ButtonDecrementDate.vue"
import ButtonIncrementDate from "@/components/header/date/ButtonIncrementDate.vue"
import ButtonDatepicker from "@/components/header/date/ButtonDatepicker.vue"

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

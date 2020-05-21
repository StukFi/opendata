<template>
    <div class="header">
        <date-widget />
        <time-widget />
    </div>
</template>

<script>
import DateWidget from "@/components/header/date/DateWidget"
import TimeWidget from "@/components/header/time/TimeWidget"

export default {
    name: "TheHeader",
    components: {
        DateWidget,
        TimeWidget
    }
}
</script>

<style>
.header {
    position: fixed;
    top: 0;
    display: flex;
    width: 100%;
    height: 60px;
    z-index: 1;
}

@media only screen and (min-width: 768px) {
    .header {
        height: 75px;
    }
}
</style>

<template>
    <div class="header">
        <date-widget />
        <time-widget />
    </div>
</template>

<script>
import DateWidget from "@/components/header/date/DateWidget.vue"
import TimeWidget from "@/components/header/time/TimeWidget.vue"

export default {
    name: "TheHeader",
    components: {
        DateWidget,
        TimeWidget
    }
}
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    display: flex;
    width: 100%;
    height: 5em;
    z-index: $z-index-header;
}
</style>

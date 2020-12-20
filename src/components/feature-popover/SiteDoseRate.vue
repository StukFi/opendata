<template>
    <div class="site-dose-rate">
        <span class="site-dose-rate__value">
            {{ doseRate }}<span class="site-dose-rate__unit"> &#181;sv/h</span>
        </span>
    </div>
</template>

<script>
export default {
    name: "SiteDoseRate",
    props: {
        feature: {
            type: Object,
            default: undefined
        }
    },
    computed: {
        doseRate () {
            return this.feature ? this.feature.get("doseRate") : "-"
        }
    }
}
</script>

<style lang="scss">
.site-dose-rate {
    text-align: center;
    font-size: $font-lg;
    font-family: $font-regular;
    margin: 0.5em 0 0 0;
}

.site-dose-rate__value {
    position: relative;
    line-height: 100%;
}

.site-dose-rate__unit {
    white-space: pre;
    font-size: $font-xs;
    bottom: 0;
}
</style>

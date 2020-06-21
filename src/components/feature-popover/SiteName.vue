<template>
    <p class="site-name">
        {{ site }}
    </p>
</template>

<script>
export default {
    name: "SiteName",
    props: {
        feature: {
            type: Object,
            default: undefined
        }
    },
    computed: {
        site () {
            return this.feature ? this.feature.get("site") : "-"
        }
    }
}
</script>

<style>
.site-name {
    text-align: center;
    font-weight: bold;
    font-size: 1.15em;
    margin: 0;
}
</style>

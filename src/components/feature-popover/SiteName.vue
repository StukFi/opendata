<template>
    <div class="site-header opendata-row">
        <span class="site-name">
            {{ site }}
        </span>
        <span
            v-show="!disableCloseButton"
            class="close-button"
            @click="$emit('close')"
        >&times;</span>
    </div>
</template>

<script>
export default {
    name: "SiteName",
    props: {
        feature: {
            type: Object,
            default: undefined
        },
        disableCloseButton: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        site () {
            return this.feature ? this.feature.get("site") : "-"
        }
    }
}
</script>

<style lang="scss" scoped>
.site-header {
    text-align: center;
    justify-content: center;
}

.site-name {
    text-align: center;
    font-size: $font-lg;
    margin: 0;
}

.close-button {
    position: absolute;
    right: 1.5em;
    font-size: $font-lg;
    transform: scale(1.5);
    height: 2em;
    line-height: 2em;

    &:hover {
        cursor: pointer;
    }
}
</style>

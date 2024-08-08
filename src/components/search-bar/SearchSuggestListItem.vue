<template>
    <p
        class="search-suggest-list-item"
        @click="$emit('click')"
    >
        {{ suggestion }}
    </p>
</template>

<script>
export default {
    name: "SearchSuggestListItem",
    props: {
        suggestion: {
            type: String,
            required: true
        }
    },
    emits: ["click"]
}
</script>

<style lang="scss">
.search-suggest-list-item {
    height: 2.5em;
    line-height: 2.5em;
    padding-left: 1.25em;
    margin: 0;
    font-size: $font-md;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>

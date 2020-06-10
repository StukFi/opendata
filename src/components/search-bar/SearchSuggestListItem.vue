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
    }
}
</script>

<style>
.search-suggest-list-item {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    margin: 0;
}
</style>

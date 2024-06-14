<template>
    <div
        v-show="isEnabled && suggestions.length > 0"
        class="search-suggest-list"
    >
        <div class="list-container">
            <search-suggest-list-item
                v-for="suggestion in suggestions"
                :key="suggestion"
                :suggestion="suggestion"
                @click="$emit('select', suggestion)"
            />
        </div>
    </div>
</template>

<script>
import SearchSuggestListItem from "@/components/search-bar/SearchSuggestListItem.vue"

export default {
    name: "SearchSuggestList",
    emits: ['select'],
    components: {
        SearchSuggestListItem
    },
    props: {
        searchTerm: {
            type: String,
            required: true
        },
        sites: {
            type: Array,
            required: true
        }
    },
    data: function () {
        return {
            isEnabled: false
        }
    },
    computed: {
        suggestions () {
            let suggestions = []
            this.sites.forEach(site => {
                if (site.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0) {
                    if (!suggestions.includes(site)) {
                        suggestions.push(site)
                    }
                }
            })

            return suggestions.sort()
        }
    },
    methods: {
        show () {
            this.isEnabled = true
        },
        hide () {
            this.isEnabled = false
        }
    }
}
</script>

<style lang="scss">
.search-suggest-list {
    position: relative;
    top: 3.25em;
    height: auto;
    max-height: 15em;
    overflow: hidden;
    padding: 0.25em;
    background-color: white;
    border: 1px solid #CCC;
    border-radius: $border-radius-sm;
    font-family: $font-medium;
    color: $color-font-dark;
    z-index: $z-index-search-suggestion-list;
}

.list-container {
    overflow: auto;
    height: auto;
    max-height: 14em;
}

.search-suggest-list:hover {
    cursor: pointer;
}
</style>

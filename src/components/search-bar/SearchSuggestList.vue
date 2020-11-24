<template>
    <div
        v-show="isEnabled && suggestions.length > 0"
        class="search-suggest-list"
    >
        <search-suggest-list-item
            v-for="suggestion in suggestions"
            :key="suggestion"
            :suggestion="suggestion"
            @click="$emit('select', suggestion)"
        />
    </div>
</template>

<script>
import SearchSuggestListItem from "./SearchSuggestListItem"

export default {
    name: "SearchSuggestList",
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

<style>
.search-suggest-list {
    position: relative;
    top: 4em;
    max-height: 12em;
    overflow: scroll;
    overflow-x: unset;
    background-color: white;
    border: 1px solid #CCC;
}

.search-suggest-list:hover {
    cursor: pointer;
}
</style>

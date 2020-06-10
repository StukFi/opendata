<template>
    <div
        v-show="isEnabled"
        class="search-suggest-list"
        @clickaway="hide"
    >
        <search-suggest-list-item
            v-for="suggestion in suggestions"
            :key="suggestion"
            :suggestion="suggestion"
            @click="$emit('search', suggestion)"
        />
    </div>
</template>

<script>
import SearchSuggestListItem from "./SearchSuggestListItem"
import { mixin as clickaway } from "vue-clickaway"

export default {
    name: "SearchSuggestList",
    components: {
        SearchSuggestListItem
    },
    mixins: [ clickaway ],
    props: {
        searchTerm: {
            type: String,
            required: true
        },
        features: {
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
            this.features.forEach(feature => {
                const site = feature.get("site")
                if (site.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0) {
                    if (!suggestions.includes(site)) {
                        suggestions.push(site)
                    }
                }
            })

            // Sort alphabetically.
            // suggestions.sort((a, b) => {
            //     return (a > b) ? 1 : (a < b) ? -1 : 0
            // })

            return suggestions
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
    top: 55px;
    max-height: 212px;
    overflow: scroll;
    overflow-x: unset;
    background-color: white;
    border: 1px solid #CCC;
}

.search-suggest-list:hover {
    cursor: pointer;
}
</style>

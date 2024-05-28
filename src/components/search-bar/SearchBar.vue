<template>
    <div
        class="search-bar"
        v-click-away="blur"
    >
        <span
            class="search-bar__icon"
            @click="search()"
        />
        <input
            ref="searchBarInput"
            :value="searchTerm"
            type="text"
            maxlength="28"
            :spellcheck=false
            class="search-bar__input"
            @input="searchTerm = $event.target.value"
            @click="showSuggestions()"
            @focus="showSuggestions()"
            @keyup.enter="search()"
        >
        <search-suggest-list
            ref="searchSuggestList"
            :search-term="searchTerm"
            :sites="sites"
            @select="onSuggestionSelected"
        />
    </div>
</template>

<script>
import SearchSuggestList from "./SearchSuggestList"
import VueClickAway from "vue3-click-away"
import eventBus from '@/utils/eventBus'

export default {
    name: "SearchBar",
    emits: ['featureSelectedViaSearch'],
    components: {
        SearchSuggestList
    },
    mixins: [ VueClickAway ],
    data: function () {
        return {
            searchTerm: "",
            features: []
        }
    },
    computed: {
        sites () {
            let sites = []
            for (let i = 0; i < this.features.length; ++i) {
                const site = this.features[i].get("site")
                if (!sites.includes(site)) {
                    sites.push(site)
                }
            }

            return sites
        }
    },
    mounted () {
        eventBus.$on("doseRateLayerChanged", this.onDoseRateLayerChanged)
    },
    methods: {
        onDoseRateLayerChanged (layer) {
            this.features = layer.getSource().getFeatures()
        },
        onSuggestionSelected (suggestion) {
            this.searchTerm = suggestion
            this.search()
        },
        search() {
            if (this.searchTerm.length == 0) {
                return
            }

            for (let i = 0; i < this.features.length; ++i) {
                const site = this.features[i].get("site")
                if (site.toLowerCase() == this.searchTerm.toLowerCase()) {
                    this.searchTerm = site
                    this.blur()
                    eventBus.$emit("featureSelectedViaSearch", this.features[i])
                    break
                }
            }
        },
        showSuggestions () {
            this.$refs.searchSuggestList.show()
        },
        hideSuggestions () {
            this.$refs.searchSuggestList.hide()
        },
        blur () {
            this.$refs.searchBarInput.blur()
            this.hideSuggestions()
        },
    }
}
</script>

<style lang="scss">
.search-bar {
    position: absolute;
    height: 3em;
    width: 16em;
    top: 6em;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.25em;
    z-index: $z-index-search-bar;
    background-color: $color-map-control-bg;
}

.search-bar:hover {
    background-color: $color-map-control-bg-hover;
}

.search-bar__input {
    font-size: $font-md;
    height: 2.75em;
    width: 15.75em;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    line-height: 2.5em;
    background-color: $color-map-control-fg;
    border-radius: 0.25em;
    text-align: center;
    color: white;
    border: none;
    font-family: $font-medium;
    text-overflow: ellipsis;
}

.search-bar__input:hover {
    background-color: $color-map-control-fg-hover;
}

.search-bar__input:focus {
    outline: none;
}

.search-bar__icon {
    position: absolute;
    width: 3em;
    height: 3em;
    background-image: url("~@/assets/icons/magnifying-glass.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 35%;
    z-index: $z-index-search-bar-icon;
}

.search-bar__icon:hover {
    cursor: pointer;
}
</style>

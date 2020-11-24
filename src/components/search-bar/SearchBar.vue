<template>
    <div
        v-on-clickaway="blur"
        class="search-bar"
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
            spellcheck="false"
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
import { mixin as clickaway } from "vue-clickaway"

export default {
    name: "SearchBar",
    components: {
        SearchSuggestList
    },
    mixins: [ clickaway ],
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
        this.$root.$on("doseRateLayerChanged", this.onDoseRateLayerChanged)
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
                    this.$root.$emit("featureSelectedViaSearch", this.features[i])
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
    top: 5em;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.25em;
    z-index: $z-index-search-bar;
    background-color: rgba(255, 255, 255, 0.4);
}

.search-bar:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.search-bar__input {
    height: 2.5em;
    width: 16em;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    line-height: 2.5em;
    background-color: rgba(0, 50, 136, 0.5);
    border-radius: 0.25em;
    text-align: center;
    color: white;
    border: none;
}

.search-bar__input:hover {
    background-color: rgba(0, 60, 136, 0.7);
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
    z-index: 5;
}

.search-bar__icon:hover {
    cursor: pointer;
}
</style>

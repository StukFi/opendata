<template>
    <div
        class="backdrop"
        @click="$emit('click')"
    />
</template>

<script>
export default {
    name: "BaseBackdrop",
    emits: ['click']
}
</script>

<style lang="scss" scoped>
.backdrop {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    z-index: $z-index-backdrop;
    background-color: rgba(0, 0, 0, 0.75);
    display:block
}
</style>

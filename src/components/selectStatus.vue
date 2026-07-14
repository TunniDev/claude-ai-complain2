<template>
    <v-select
        v-model="selectedStatus"
        :items="statusCall"
        label="สถานะการดำเนินงาน"
        variant="underlined"
        @update:model-value="filterItems"
    ></v-select>
</template>

<script>
export default {
    props: ['itemsStatus'],
    data:() => ({
       selectedStatus: 'ทั้งหมด',
    }),
    computed: {
        statusCall() {
            return Array.from(new Set(this.itemsStatus.map(itemsStatus => itemsStatus.value)));
        },
    },
    methods: {
        filterItems() {
            this.$forceUpdate();
        },
    },
}
</script>

<style>
</style>

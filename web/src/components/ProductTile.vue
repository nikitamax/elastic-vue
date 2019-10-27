<template>
  <div class="product">
    <div class="name">{{product._source.name}}</div>
    <div class="image">
      <img :src="product._source.image" :alt="product._source.name" />
    </div>
    <div>{{product._source.price}} $</div>
  </div>
</template>

<script>
export default {
  name: "ProductTile",
  props: {
    product: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.product {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  width: 31%;
  min-width: 200px;
  padding: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.name {
  overflow: hidden;
  max-height: 54px;
}
.image img {
  display: initial;
  width: auto;
  height: 180px;
}
</style>

<template>
  <div class="container">
    <section class="search">
      <b-input placeholder="Search" @keyup.native.enter="search" v-model="query"></b-input>
    </section>
    <div class="product-count">{{ `${total} products`}}</div>
    <div class="products-list">
      <product-tile v-for="product in products" :key="product._id" :product="product" />
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import ProductTile from "./ProductTile";
import { api } from "../utils.ts";
import axios from "axios";
import "buefy/dist/buefy.css";
export default {
  name: "Search",
  data() {
    return {
      query: "",
      page: 0,
      total: 0,
      products: []
    };
  },
  components: {
    ProductTile,
    InfiniteLoading
  },
  methods: {
    infiniteHandler($state) {
      axios
        .get(`${api}/products?p=${this.page}&q=${this.query}`)
        .then(response => {
          this.total = response.data.total;
          const products = response.data.hits;
          if (products.length) {
            this.page += 1;
            this.products.push(...products);
            if ($state) {
              $state.loaded();
            }
          } else {
            $state.complete();
          }
        });
    },
    search() {
      axios.get(`${api}/search?q=${this.query}`).then(response => {
        this.products = response.data.hits;
        this.total = response.data.total;
      });
    }
  },
  beforeMount() {
    this.infiniteHandler();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search {
  display: flex;
}
.products-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px;
}
.product-count {
  width: 100%;
  padding-left: 20px;
  text-align: start;
}
.autocomplete {
  width: 300px;
}
</style>

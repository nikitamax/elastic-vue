<template>
  <div class="container">
    <section class="search">
      <b-input placeholder="Search" @keyup.native.enter="listProducts" v-model="query"></b-input>
      <b-select @input="changeSort" v-model="sortBy" placeholder="Sort by">
        <option v-for="option in sortParams" :value="option" :key="option">{{ option }}</option>
      </b-select>
    </section>
    <div class="product-count">{{ `${total} products`}}</div>
    <div class="products-list">
      <product-tile v-for="product in products" :key="product._id" :product="product" />
    </div>
  </div>
</template>

<script>
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
      loading: false,
      sortParams: ["Default", "Price Low-High", "Price High-Low"],
      products: [],
      sortBy: "Default"
    };
  },
  components: {
    ProductTile
  },
  methods: {
    async loadMore() {
      this.loading = true;
      const response = await this.getProducts();
      this.total = response.data.total;
      const products = response.data.hits;
      if (products.length) {
        this.page += 1;
        this.products.push(...products);
      } else {
        console.log("Done");
      }
      this.loading = false;
    },
    handleScroll({
      target: {
        scrollingElement: { scrollTop, clientHeight, scrollHeight }
      }
    }) {
      if (scrollTop + clientHeight + 500 >= scrollHeight) {
        if (!this.loading && this.products.length < this.total - 1)
          this.loadMore();
      }
    },
    async listProducts() {
      this.page = 0;
      const response = await this.getProducts();
      this.total = response.data.total;
      this.products = response.data.hits;
      this.page = 1;
    },
    getProducts() {
      return axios.get(
        `${api}/products?page=${this.page}&query=${this.query}&sort=${this.sortBy}`
      );
    },
    changeSort() {
      this.listProducts();
    }
  },
  created: function() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed: function() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  beforeMount() {
    this.listProducts();
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

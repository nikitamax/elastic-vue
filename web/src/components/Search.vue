<template>
  <div>
    <div>
      <h1>Search Producs</h1>
    </div>
    <form>
      <div>
        <label for="search">Search</label>
        <input type="text" name="search" id="search" placeholder="search" v-model="query" />
        <span></span>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Search",
  data() {
    return {
      query: "",
      products: []
    };
  },
  methods: {
    search: function() {
      axios
        .get("http://127.0.0.1:3001/search?q=" + this.query)
        .then(response => {
          console.log(response);
          this.products = response.data;
        });
    }
  },
  watch: {
    query: function() {
      this.search();
    }
  },
  beforeMount() {}
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

const App = {
  data() {
    return {
      products: [],
      selectedSort: (a, b) => a.price - b.price,
      sortedBy: {
        'от дорогой к дешевой': (a, b) => b.price - a.price,
        'от дешевой к дорогой': (a, b) => a.price - b.price,
      }
    }
  },

  async mounted() {
    const res = await fetch('/api/buckweat-data');
    this.products = await res.json();

    console.log(this.products);
  },

  computed: {
    sortedProducts() {
      return this.products.sort(this.selectedSort)
    }
  }
};

Vue.createApp(App).mount('#app');

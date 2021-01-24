const App = {
  data() {
    return {
      products: [],
    }
  },

  async mounted() {
    const res = await fetch('/api/buckweat-data');
    this.products = await res.json();

    console.log(this.products);
  }
};

Vue.createApp(App).mount('#app');

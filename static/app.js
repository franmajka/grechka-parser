const App = {
  data() {
    return {
      products: [],
      selectedSort: (a, b) => a.price - b.price,
      sortedBy: {
        'от дорогой к дешевой': (a, b) => b.price - a.price,
        'от дешевой к дорогой': (a, b) => a.price - b.price,
      },
      filteredByPrice: {
        from: null,
        to: null,
      }
    };
  },

  async mounted() {
    const res = await fetch('/api/buckweat-data');
    this.products = await res.json();
  },

  computed: {
    sortedProducts() {
      return this.products.sort(this.selectedSort);
    },

    filteredProducts() {
      return this.sortedProducts.filter(v =>
        (!(typeof this.filteredByPrice.from === 'number') || this.filteredByPrice.from <= v.price) &&
        (!(typeof this.filteredByPrice.to === 'number') || v.price <= this.filteredByPrice.to)
      );
    }
  }
};

// eslint-disable-next-line no-undef
Vue.createApp(App).mount('#app');

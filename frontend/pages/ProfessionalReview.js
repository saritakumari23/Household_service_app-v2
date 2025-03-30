export default {
    template: `
      <div class="container my-5">
        <h2 class="text-center text-primary mb-4">{{ professionalName }}</h2>
        <div v-if="reviews.length > 0">
          <div 
            v-for="review in reviews" 
            :key="review.cust.id" 
            class="card shadow-lg mb-3">
            <div class="card-body">
              <h5 class="card-title text-success">{{ review.cust.name }}</h5>
              <p class="card-text">
                {{ review.review }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-danger text-center">No reviews available for this professional.</p>
        </div>
      </div>
    `,
    data() {
      return {
        reviews: [],
        professionalName: "Professional Reviews",
      };
    },
    async mounted() {
      const professionalId = this.$route.params.id;
      try {
        const res = await fetch(`${location.origin}/api/profreview/${professionalId}`, {
          headers: {
            Authorization: this.$store.state.auth_token,
          },
        });
  
        if (res.ok) {
          const data = await res.json();
          this.professionalName = data[0].Professional;
          this.reviews = data.slice(1);
        } else {
          console.error("Failed to fetch reviews.");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    },
  };
  
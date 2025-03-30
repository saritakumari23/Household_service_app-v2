export default {
  props: ["id"],
  template: `
    <div class="container my-5">
      <h2 class="text-center text-primary mb-4">Availabe Professionals</h2>
      
      <!-- Search Box for Professionals -->
      <div class="mb-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search professionals by pincode..." 
          v-model="searchQuery" 
        />
      </div>

      <!-- Professionals List Starts from Here -->
      <div class="row">
        <div 
          v-for="professional in filteredProfessionals" 
          :key="professional.id" 
          class="col-md-6 col-lg-4 mb-4">
          <div class="card shadow-lg">
            <div class="card-body">
              <h5 class="card-title text-success">{{ professional.name }}</h5>
              <p class="card-text">
                <strong>Address:</strong> {{ professional.address }}<br>
                <strong>Pincode:</strong> {{ professional.pincode }}<br>
                <strong>Experience:</strong> {{ professional.experience }} years<br>
                <strong>Description:</strong> {{ professional.description }}
              </p>
              <button 
                @click="bookProfessional(professional.id)" 
                class="btn btn-outline-primary btn-block">
                Book Now
              </button>
              <button 
                @click="viewReviews(professional.id)" 
                class="btn btn-outline-success btn-block mt-2">
                View Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredProfessionals.length === 0" class="mt-4">
        <p class="text-danger text-center">No professionals found matching your search.</p>
      </div>
    </div>
  `,
  data() {
    return {
      professionals: [],
      searchQuery: "",
    };
  },
  computed: {
    filteredProfessionals() {
      return this.professionals.filter((professional) =>
        professional.pincode.includes(this.searchQuery)
      );
    },
  },
  async mounted() {
    try {
      const res = await fetch(`${location.origin}/api/prof/${this.id}`, {
        headers: {
          Authorization: this.$store.state.auth_token,
        },
      });

      if (res.ok) {
        this.professionals = await res.json();
      } else {
        console.error("Failed to fetch professionals.");
      }
    } catch (err) {
      console.error("Error fetching professionals:", err);
    }
  },
  methods: {
    async bookProfessional(professionalId) {
      try {
        const res = await fetch(`${location.origin}/api/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.$store.state.auth_token,
          },
          body: JSON.stringify({ professional_id: professionalId }),
        });

        if (res.ok) {
          const data = await res.json();
          alert(data.msg); // Success message
        } else {
          const error = await res.json();
          alert(error.msg); // Error message
        }
      } catch (err) {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
      }
    },
    viewReviews(professionalId) {
      this.$router.push(`/profReview/${professionalId}`);
    },
  },
};

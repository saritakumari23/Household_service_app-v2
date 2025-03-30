export default {
  template: `
    <div class="container mt-5">
        <h1 class="text-center">Edit Service</h1>
        <div class="card shadow mt-4">
            <div class="card-body">
                <h2 class="card-title text-center mb-4">{{ service.name }}</h2>
                
                <!-- Form for editing service -->
                <form @submit.prevent="updateService">
                    <div class="mb-3">
                        <label for="description" class="form-label">New Description</label>
                        <textarea 
                            id="description" 
                            class="form-control" 
                            v-model="form.description" 
                            rows="4" 
                            placeholder="Enter new description"
                            required
                        ></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="timeRequired" class="form-label">New Time Required (in minutes)</label>
                        <input 
                            type="number" 
                            id="timeRequired" 
                            class="form-control" 
                            v-model="form.time_required" 
                            placeholder="Enter new time required"
                            required
                        />
                    </div>
                    
                    <div class="mb-3">
                        <label for="price" class="form-label">New Price (₹)</label>
                        <input 
                            type="number" 
                            id="price" 
                            class="form-control" 
                            v-model="form.price" 
                            placeholder="Enter new price"
                            required
                        />
                    </div>
                    
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">
                            Update Service
                        </button>
                    </div>
                </form>

                <!-- Loading Spinner -->
                <div v-if="loading" class="text-center mt-4">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <!-- Success/Error Messages -->
                <div v-if="message" :class="['alert', messageType, 'mt-4']" role="alert">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
    `,
  data() {
    return {
      service: {}, // Store the service details
      form: {
        description: "",
        time_required: "",
        price: "",
      },
      loading: false, // For showing the loading spinner
      message: "", // Success/Error message
      messageType: "", // Bootstrap alert class ('alert-success' or 'alert-danger')
    };
  },
  methods: {
    async fetchService() {
      this.loading = true;
      try {
        const response = await fetch(
          `${location.origin}/api/services/${this.$route.params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch service details");
        }
        const data = await response.json();
        this.service = data; // Store the fetched service data
        this.form.description = data.description;
        this.form.time_required = data.time_required;
        this.form.price = data.price;
      } catch (error) {
        this.message = "Failed to load service details. Please try again.";
        this.messageType = "alert-danger";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateService() {
      this.loading = true;
      try {
        const response = await fetch(
          `${location.origin}/api/services/${this.service.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: this.$store.state.auth_token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.form),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update service");
        }
        this.message = "Service updated successfully!";
        this.messageType = "alert-success";
      } catch (error) {
        this.message = "Failed to update service. Please try again.";
        this.messageType = "alert-danger";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchService(); // Fetch the service details when the component is created
  },
};

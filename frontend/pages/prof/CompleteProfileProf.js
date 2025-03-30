export default {
  template: `
    <div class="container mt-5">
      <div class="card p-4 shadow">
        <h1 class="mb-4">Service Profile Form</h1>
        <form @submit.prevent="completeProfessionalProfile">
          <!-- Name -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              id="name"
              class="form-control"
              placeholder="Enter your name"
              v-model="name"
              required
            />
          </div>

          <!-- Pincode -->
          <div class="mb-3">
            <label for="pincode" class="form-label">Pincode</label>
            <input
              type="text"
              id="pincode"
              class="form-control"
              placeholder="Enter your pincode"
              v-model="pincode"
              required
            />
          </div>

          <!-- Address -->
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea
              id="address"
              class="form-control"
              rows="2"
              placeholder="Enter your address"
              v-model="address"
              required
            ></textarea>
          </div>

          <!-- Experience -->
          <div class="mb-3">
            <label for="experience" class="form-label">Experience (in years)</label>
            <input
              type="number"
              id="experience"
              class="form-control"
              placeholder="Enter your experience"
              v-model="experience"
              required
            />
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label for="description" class="form-label">Description/Resume</label>
            <textarea
              id="description"
              class="form-control"
              rows="3"
              placeholder="Describe your services"
              v-model="description"
              required
            ></textarea>
          </div>

          <!-- Service Dropdown (Modified Section) -->
          <div class="mb-3">
            <label for="service_id" class="form-label">Select Service</label>
            <select 
              id="service_id" 
              class="form-select"
              v-model="service_id"
              required
              :disabled="loadingServices"
            >
              <option value="" disabled>Select a service</option>
              <option 
                v-for="(name, id) in services" 
                :key="id" 
                :value="id"
              >
                {{ name }}
              </option>
            </select>
            <div v-if="loadingServices" class="text-muted mt-1">
              Loading services...
            </div>
            <div v-if="serviceError" class="text-danger mt-1">
              {{ serviceError }}
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      name: null,
      pincode: null,
      address: null,
      experience: null,
      description: null,
      service_id: null,
      // New data properties
      services: {},
      loadingServices: false,
      serviceError: null
    };
  },
  computed: {
    authToken() {
      return this.$store.state.auth_token;
    },
    userId() {
      return this.$store.state.user_id;
    },
  },
  beforeMount() {
    this.fetchServices();
  },
  methods: {
    async fetchServices() {
      try {
        this.loadingServices = true;
        const response = await fetch(`${location.origin}/api/name_service`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch services');
        
        this.services = await response.json();
        this.serviceError = null;
      } catch (err) {
        console.error('Service fetch error:', err);
        this.serviceError = 'Failed to load services. Please refresh the page.';
      } finally {
        this.loadingServices = false;
      }
    },

    async completeProfessionalProfile() {
      try {
        const payload = {
          user_id: this.userId,
          name: this.name,
          pincode: this.pincode,
          address: this.address,
          experience: this.experience,
          description: this.description,
          service_id: this.service_id,
        };

        const response = await fetch(`${location.origin}/api/profComplete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Profile completed successfully!");
          this.$router.push("/reqManagement");
        } else {
          alert(data.message || "Failed to complete the profile.");
        }
      } catch (error) {
        console.error("Error completing professional profile:", error);
        alert("An error occurred. Please try again later.");
      }
    },
  },
};

export default {
  template: `
  <form @submit.prevent="completeCustomerProfile">
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
  <div class="mb-3">
    <label for="address" class="form-label">Address</label>
    <textarea
      id="address"
      class="form-control"
      rows="3"
      placeholder="Enter your address"
      v-model="address"
      required
    ></textarea>
  </div>
  <button type="submit" class="btn btn-primary w-100">Complete</button>
</form>

  `,
  data() {
    return {
      name: null,
      pincode: null,
      address: null,
    };
  },
  computed: {
    user_id() {
      return this.$store.state.user_id;
    },
  },
  methods: {
    async completeCustomerProfile() {
      try {
        const payload = {
          name: this.name,
          pincode: this.pincode,
          address: this.address,
          user_id: this.user_id,
        };

        const response = await fetch(
          `${location.origin}/api/customerComplete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.authToken}`, 
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Profile completed successfully!");
          // Redirecting to the home page
          this.$router.push("/");
        } else {
          alert(data.msg || "Failed to complete profile.");
        }
      } catch (error) {
        console.error("Error completing profile:", error);
        alert("An error occurred. Please try again later.");
      }
    },
  },
};

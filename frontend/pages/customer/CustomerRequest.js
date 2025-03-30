export default {
  template: `
    <div class="container my-5">
      <h2 class="text-center text-primary mb-4">My Requests</h2>
      <div v-if="requests.length > 0" class="row">
        <div 
          v-for="request in requests" 
          :key="request.id" 
          class="col-md-6 col-lg-4 mb-4">
          <div class="card shadow-lg">
            <div class="card-body">
              <h5 class="card-title text-success">Request #{{ request.id }}</h5>
              <p class="card-text">
                <strong>Service Name:</strong> {{ request.service_name }}<br>
                <strong>Professional:</strong> {{ request.professional_name }}<br>
                <strong>Status:</strong> 
                <span :class="statusClass(request.service_status)">
                  {{ request.service_status }}
                </span><br>
                <strong>Requested On:</strong> {{ formatDate(request.date_of_request) }}
              </p>
              <!-- Mark as Completed button for assigned requests -->
              <button 
                v-if="request.service_status === 'assigned'" 
                @click="markAsCompleted(request.id)" 
                class="btn btn-success mt-2">
                Mark as Completed
              </button>
              <!-- Showing date of completion and review button -->
              <div v-else-if="request.service_status === 'completed'" class="mt-3">
                <p class="text-success">
                  <strong>Date of Completion:</strong> {{ formatDate(request.date_of_completion) }}
                </p>
                <button 
                  @click="writeReview(request.id)" 
                  class="btn btn-primary">
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <p class="text-muted">No requests found.</p>
      </div>
    </div>
  `,
  data() {
    return {
      requests: [],
    };
  },
  async mounted() {
    try {
      const res = await fetch(`${location.origin}/api/request`, {
        headers: {
          Authorization: this.$store.state.auth_token,
        },
      });

      if (res.ok) {
        this.requests = await res.json();
      } else {
        const error = await res.json();
        alert(error.msg); 
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An unexpected error occurred.");
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    statusClass(status) {
      if (status === "requested") return "text-warning";
      if (status === "assigned") return "text-primary";
      if (status === "completed") return "text-success";
      return "text-danger";
    },
    async markAsCompleted(requestId) {
      try {
        const res = await fetch(`${location.origin}/api/complete/${requestId}`, {
          method: "PUT",
          headers: {
            Authorization: this.$store.state.auth_token,
          },
        });

        if (res.ok) {
          alert("Request marked as completed successfully.");
          const updatedCompletionDate = new Date().toISOString();
          this.requests = this.requests.map((req) =>
            req.id === requestId
              ? { ...req, service_status: "completed", date_of_completion: updatedCompletionDate }
              : req
          );
        } else {
          const error = await res.json();
          alert(error.msg); 
        }
      } catch (err) {
        console.error("Error:", err);
        alert("An unexpected error occurred while updating the request.");
      }
    },
    writeReview(requestId) {
      // Redirect 
      this.$router.push(`/review/${requestId}`);
    },
  },
};

export default {
    template: `
      <div class="container mt-5">
        <h1 class="text-center mb-4">Manage Requests</h1>
        
        <div v-if="requests.length === 0" class="text-center">
          <p>Waiting for requests...</p>
        </div>
  
        <div v-else>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Date of Request</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request.id">
                <td>{{ request.id }}</td>
                <td>{{ request.customer_name || 'N/A' }}</td>
                <td>{{ request.customer_address || 'N/A' }}</td>
                <td>{{ formatDate(request.date_of_request) }}</td>
                <td :class="statusClass(request.service_status)">
                  {{ request.service_status }}
                </td>
                <td>
                  <button 
                    v-if="request.service_status === 'requested'" 
                    @click="acceptRequest(request.id)" 
                    class="btn btn-success btn-sm">
                    Accept
                  </button>
                  <button 
                  v-if="request.service_status === 'requested'" 
                    @click="deleteRequest(request.id)" 
                    class="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
      async acceptRequest(requestId) {
        if (!confirm("Are you sure you want to accept this request?")) return;
  
        try {
          const res = await fetch(`${location.origin}/api/request`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.$store.state.auth_token,
            },
            body: JSON.stringify({ request_id: requestId }),
          });
  
          if (res.ok) {
            alert("Request accepted successfully!");
            this.requests = this.requests.map((req) =>
              req.id === requestId ? { ...req, service_status: "assigned" } : req
            );
          } else {
            const error = await res.json();
            alert(error.msg); 
          }
        } catch (err) {
          console.error("Error:", err);
          alert("An unexpected error occurred.");
        }
      },
      async deleteRequest(requestId) {
        if (!confirm("Are you sure you want to delete this request?")) return;
  
        try {
          const res = await fetch(`${location.origin}/api/request`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.$store.state.auth_token,
            },
            body: JSON.stringify({ request_id: requestId }),
          });
  
          if (res.ok) {
            alert("Request deleted successfully!");
            this.requests = this.requests.filter((req) => req.id !== requestId);
          } else {
            const error = await res.json();
            alert(error.msg); 
          }
        } catch (err) {
          console.error("Error:", err);
          alert("An unexpected error occurred.");
        }
      },
    },
  };
  
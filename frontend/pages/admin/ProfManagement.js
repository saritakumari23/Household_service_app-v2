export default {
    template: `
      <div class="container mt-5">
        <h1 class="text-center mb-4">Professional Management</h1>
        <div v-if="unverified_profs.length === 0" class="text-center">
          <p>No unverified professionals found.</p>
        </div>
        <table v-else class="table table-bordered table-striped">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Pincode</th>
              <th>Address</th>
              <th>Experience</th>
              <th>Description</th>
              <th>Service ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prof, index) in unverified_profs" :key="prof.id">
              <td>{{ index + 1 }}</td>
              <td>{{ prof.name }}</td>
              <td>{{ prof.pincode }}</td>
              <td>{{ prof.address }}</td>
              <td>{{ prof.experience }} years</td>
              <td>{{ prof.description }}</td>
              <td>{{ prof.service_id }}</td>
              <td>
                <button 
                  class="btn btn-success btn-sm mr-2" 
                  @click="acceptProf(prof.id)"
                >
                  Accept
                </button>
                <button 
                  class="btn btn-danger btn-sm" 
                  @click="deleteProf(prof.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    data() {
      return {
        unverified_profs: [],
      };
    },
    computed: {
      authToken() {
        return this.$store.state.auth_token;
      },
    },
    async mounted() {
      await this.fetchUnverifiedProfs();
    },
    methods: {
      async fetchUnverifiedProfs() {
        try {
          const res = await fetch(`${location.origin}/api/unprof`, {
            headers: {
              Authorization: `${this.authToken}`,
            },
          });
          this.unverified_profs = await res.json();
          console.log("Fetched unverified professionals:", this.unverified_profs);
        } catch (error) {
          console.error("Error fetching unverified professionals:", error);
        }
      },
      async acceptProf(profId) {
        try {
          const res = await fetch(`${location.origin}/api/acceptProf/${profId}`, {
            method: "POST",
            headers: {
              Authorization: `${this.authToken}`,
            },
          });
          if (res.ok) {
            this.unverified_profs = this.unverified_profs.filter(prof => prof.id !== profId);
            alert("Professional accepted successfully!");
          } else {
            alert("Failed to accept professional.");
          }
        } catch (error) {
          console.error("Error accepting professional:", error);
        }
      },
      async deleteProf(profId) {
        try {
          const res = await fetch(`${location.origin}/api/deleteProf/${profId}`, {
            method: "DELETE",
            headers: {
              Authorization: `${this.authToken}`,
            },
          });
          if (res.ok) {
            this.unverified_profs = this.unverified_profs.filter(prof => prof.id !== profId);
            alert("Professional deleted successfully!");
          } else {
            alert("Failed to delete professional.");
          }
        } catch (error) {
          console.error("Error deleting professional:", error);
        }
      },
    },
  };
  
export default {
    template: `
      <div class="container mt-5">
        <h1 class="mb-4 text-center">Admin User Management</h1>
  
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.pincode }}</td>
              <td :class="user.active ? 'text-success' : 'text-danger'">
                {{ user.active ? 'Active' : 'Blocked' }}
              </td>
              <td>
                <button
                  v-if="user.active"
                  class="btn btn-danger btn-sm"
                  @click="blockUser(user.id)"
                >
                  Block
                </button>
                <button
                  v-else
                  class="btn btn-success btn-sm"
                  @click="unblockUser(user.id)"
                >
                  Unblock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    data() {
      return {
        users: [],
      };
    },
    async mounted() {
      try {
        // Fetch users from backend
        const res = await fetch(`${location.origin}/api/user`, {
          headers: {
            Authorization: this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          this.users = await res.json();
        } else {
          const error = await res.json();
          alert(error.msg);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("An unexpected error occurred.");
      }
    },
    methods: {
      async blockUser(userId) {
        if (!confirm("Are you sure you want to block this user?")) return;
  
        try {
          const res = await fetch(`${location.origin}/api/block/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: this.$store.state.auth_token,
            },
          });
          const result = await res.json();
          if (res.ok) {
            alert(result.msg);
            this.updateUserStatus(userId, false); // Update status in UI
          } else {
            alert(result.msg);
          }
        } catch (err) {
          console.error("Error blocking user:", err);
          alert("An unexpected error occurred.");
        }
      },
      async unblockUser(userId) {
        if (!confirm("Are you sure you want to unblock this user?")) return;
  
        try {
          const res = await fetch(`${location.origin}/api/unblock/${userId}`, {
            method: "PUT",
            headers: {
              Authorization: this.$store.state.auth_token,
            },
          });
          const result = await res.json();
          if (res.ok) {
            alert(result.msg);
            this.updateUserStatus(userId, true); // Update status in UI
          } else {
            alert(result.msg);
          }
        } catch (err) {
          console.error("Error unblocking user:", err);
          alert("An unexpected error occurred.");
        }
      },
      updateUserStatus(userId, isActive) {
        const user = this.users.find((u) => u.id === userId);
        if (user) user.active = isActive;
      },
    },
  };
  
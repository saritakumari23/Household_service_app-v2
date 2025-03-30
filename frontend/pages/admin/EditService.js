export default {
    template: `
    <div class="container mt-5">
        <h1 class="text-center mb-4">All Services</h1>
        <div class="card shadow">
            <div class="card-body">
                <!-- Table for displaying services -->
                <table class="table table-hover table-bordered text-center align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price (₹)</th>
                            <th>Time Required (mins)</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id">
                            <td>{{ service.id }}</td>
                            <td>{{ service.name }}</td>
                            <td>₹{{ service.price }}</td>
                            <td>{{ service.time_required }} mins</td>
                            <td>{{ service.description }}</td>
                            <td>
                                <router-link :to="'/editService/' + service.id" class="btn btn-primary btn-sm">
                                    Edit
                                </router-link>
                                <button @click="deleteService(service.id)" class="btn btn-danger btn-sm ms-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="loading" class="text-center mt-3">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-if="error" class="alert alert-danger mt-3">
                    Failed to load services. Please try again later.
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            services: [],
            loading: false,
            error: false,
        };
    },
    methods: {
        async fetchServices() {
            this.loading = true;
            this.error = false;
            try {
                const response = await fetch(`${location.origin}/api/services`);
                if (!response.ok) throw new Error("Failed to fetch services");
                this.services = await response.json();
            } catch (err) {
                console.error(err);
                this.error = true;
            } finally {
                this.loading = false;
            }
        },

        async deleteService(serviceId) {
            if (!confirm("Note: This will delete the professional and all associated requests. Do you want to continue?")) {
                return;
            }
            
            try {
                const response = await fetch(`${location.origin}/api/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: this.$store.state.auth_token,
                        "Content-Type": "application/json",
                      }
                });

                if (!response.ok) throw new Error('Failed to delete service');
                
                // Remove the deleted service from the local list
                this.services = this.services.filter(service => service.id !== serviceId);
                alert('Service deleted successfully!');
            } catch (err) {
                console.error(err);
                alert('Failed to delete service. Please try again.');
            }
        }
    },
    created() {
        this.fetchServices();
    },
};

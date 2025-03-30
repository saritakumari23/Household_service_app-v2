export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">Edit Your Profile</h2>
        <form @submit.prevent="updateCustomer">
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="customer.name" 
                    required 
                />
            </div>
            <div class="mb-3">
                <label for="pincode" class="form-label">Pincode</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="pincode" 
                    v-model="customer.pincode" 
                    required 
                />
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <textarea 
                    class="form-control" 
                    id="address" 
                    v-model="customer.address" 
                    rows="3" 
                    required>
                </textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
        <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
            {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
            {{ errorMessage }}
        </div>
    </div>
    `,
    data() {
        return {
            customer: {
                name: "",
                pincode: "",
                address: ""
            },
            successMessage: "",
            errorMessage: ""
        };
    },
    methods: {
        // Fetch the customer's data from the backend
        async fetchCustomerData() {
            try {
                const token = this.$store.state.auth_token; 
                const response = await fetch("/api/cust", {
                    headers: {
                        "Authorization": `${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch customer data");
                const data = await response.json();
                this.customer = data; 
            } catch (error) {
                this.errorMessage = "Unable to load profile data.";
                console.error(error);
            }
        },

        // Update the customer's profile
        async updateCustomer() {
            try {
                const token = this.$store.state.auth_token; // Retrieve token from $store
                const response = await fetch("/api/cust", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${token}`
                    },
                    body: JSON.stringify(this.customer)
                });
                if (!response.ok) throw new Error("Failed to update profile");
                const data = await response.json();
                this.successMessage = "Profile updated successfully!";
                this.errorMessage = ""; // Clear any previous error message
            } catch (error) {
                this.successMessage = ""; // Clear any previous success message
                this.errorMessage = "Failed to update profile. Please try again.";
                console.error(error);
            }
        }
    },
    mounted() {
        this.fetchCustomerData(); 
    }
};

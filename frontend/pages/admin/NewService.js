export default {
    template: `
      <div class="container mt-5">
        <h1 class="text-center mb-4">Add a New Service</h1>
        <form @submit.prevent="submitForm" class="border p-4 rounded shadow">
          <div class="mb-3">
            <label for="name" class="form-label">Service Name</label>
            <input 
              type="text" 
              id="name" 
              class="form-control" 
              v-model="service.name" 
              required 
              placeholder="Enter the service name"
            />
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input 
              type="number" 
              id="price" 
              class="form-control" 
              v-model="service.price" 
              required 
              placeholder="Enter the price"
            />
          </div>
          <div class="mb-3">
            <label for="time" class="form-label">Time Required (in minutes)</label>
            <input 
              type="number" 
              id="time" 
              class="form-control" 
              v-model="service.time_required" 
              required 
              placeholder="Enter time required"
            />
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea 
              id="description" 
              class="form-control" 
              v-model="service.description" 
              required 
              placeholder="Enter a description for the service"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Service</button>
        </form>
      </div>
    `,
    data() {
      return {
        service: {
          name: '',
          price: '',
          time_required: '',
          description: '',
        },
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await fetch(`${location.origin}/api/services`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: this.$store.state.auth_token, // Pass the token for authentication
            },
            body: JSON.stringify(this.service),
          });
  
          const data = await response.json();
          if (response.ok) {
            alert(data.msg); // Success message
            this.service = { name: '', price: '', time_required: '', description: '' }; // Reset form
          } else {
            alert(data.msg); // Error message from server
          }
        } catch (err) {
          console.error('Error:', err);
          alert('An unexpected error occurred.');
        }
      },
    },
  };
  
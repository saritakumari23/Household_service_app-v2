import ServicsCard from "../components/ServicsCard.js";

export default {
  template: `
    <div>
      <h1 class="mb-4">Choose From Our Services</h1>
      
      <!-- Search Box for Services -->
      <div class="mb-4">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search services by name..." 
          v-model="searchQuery" 
        />
      </div>

      <!-- Services List Starts from Here -->
      <div v-if="filteredServices.length > 0">
        <ServicsCard 
          v-for="service in filteredServices" 
          :key="service.id" 
          :name="service.name" 
          :id="service.id" 
          :price="service.price" 
          :time_required="service.time_required" 
          :description="service.description"> 
        </ServicsCard>
      </div>
      
      <!-- No Results Found -->
      <div v-else>
        <p class="text-danger">No services found matching your search.</p>
      </div>
    </div>
  `,
  data() {
    return {
      services: [], 
      searchQuery: "", 
    };
  },
  computed: {
    filteredServices() {
      return this.services.filter((service) =>
        service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  async mounted() {
    try {
      const res = await fetch(location.origin + "/api/services");
      this.services = await res.json(); 
      console.log("Fetched Services:", this.services); 
    } catch (error) {
      console.error("Error fetching services:", error); 
    }
  },
  components: {
    ServicsCard,
  },
};

export default {
    data() {
        return {
            isGeneratingCSV: false,
            taskId: null
        }
    },
    methods: {
        async generateCSV() {
            this.isGeneratingCSV = true;
            try {
                const response = await fetch('/api/generate-csv', {
                    method: 'POST',
                    headers: {
                        'Authorization': this.$store.state.auth_token,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                this.taskId = data.task_id;
                this.checkCSVStatus();
            } catch (error) {
                console.error('Error generating CSV:', error);
                this.isGeneratingCSV = false;
            }
        },
        async checkCSVStatus() {
            if (!this.taskId) return;

            try {
                const response = await fetch(`/get_csv/${this.taskId}`, {
                    headers: {
                        'Authorization': this.$store.state.auth_token
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'completed_requests.csv';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.isGeneratingCSV = false;
                } else if (response.status === 405) {
                    setTimeout(() => this.checkCSVStatus(), 2000); // Check again after 2 seconds
                } else {
                    console.error('Error downloading CSV');
                    this.isGeneratingCSV = false;
                }
            } catch (error) {
                console.error('Error checking CSV status:', error);
                this.isGeneratingCSV = false;
            }
        }
    },
    template: `
        <div class="container mt-5">
            <div class="card shadow-lg">
                <div class="card-header bg-primary text-white">
                    <h1 class="text-center">Welcome Admin</h1>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <router-link 
                            to="/profManagement" 
                            class="list-group-item list-group-item-action">
                            New Professional Acceptance
                        </router-link>
                        <router-link 
                            to="/newService" 
                            class="list-group-item list-group-item-action">
                            Add New Services
                        </router-link>
                        <router-link 
                            to="/blockUser" 
                            class="list-group-item list-group-item-action">
                            Block/Unblock an Existing User
                        </router-link>
                        <router-link 
                            to="/editService" 
                            class="list-group-item list-group-item-action">
                            Edit a Service
                        </router-link>
                        <button 
                            @click="generateCSV" 
                            class="list-group-item list-group-item-action"
                            :disabled="isGeneratingCSV">
                            {{ isGeneratingCSV ? 'Generating CSV...' : 'Download Completed Requests' }}
                        </button>
                    </div>
                </div>
                <div class="card-footer text-center">
                    <small class="text-muted">Made by Sarita Kumari</small>
                </div>
            </div>
        </div>
    `
}

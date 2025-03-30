export default {
    props: ['name', 'id', 'price', 'description', 'time_required'],
    template: `
      <div class="jumbotron bg-light p-5">
        <div class="container">
          <div class="card shadow-lg">
            <div class="card-body">
              <h5 class="card-title text-primary">{{ name }}</h5>
              <p class="card-text">
              
                <strong>Description:</strong> {{ description }}
              </p>
              <p class="card-text">
                <strong>Price:</strong> Rs {{ price }}<br>
                <strong>Time Required:</strong> {{ time_required }} minutes
              </p>
              <button 
                @click="$router.push('/service/' + id)" 
                class="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
  };
  
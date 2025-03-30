// LoginPage.js
export default {
    template: `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-center mb-4">Log In</h3>
                <form @submit.prevent="submitLogin">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      class="form-control"
                      placeholder="Enter your email"
                      v-model="email"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      class="form-control"
                      placeholder="Enter your password"
                      v-model="password"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary w-100">Log In</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        email: null,
        password: null,
      };
    },
    methods: {
      async submitLogin() {
        const res = await fetch(location.origin + '/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        if (res.ok) {
          console.log('We are Logged In');
          const data = await res.json();
          console.log(data);
          localStorage.setItem('user', JSON.stringify(data));
          this.$store.commit('setUser');
          this.$router.push('/');
        }
        else{
          alert('Invalid Credentials');
        }
      },
    },
  };
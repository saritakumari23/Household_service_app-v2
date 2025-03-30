// RegisterPage.js
export default {
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Register</h3>
              <form @submit.prevent="submitRegister">
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
                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <select
                    id="role"
                    class="form-select"
                    v-model="role"
                    required
                  >
                    <option value="" disabled selected>Select your role</option>
                    <option value="Customer">Customer</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-success w-100">Register</button>
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
      role: null,
    };
  },
  methods: {
    async submitRegister() {
      try {
        // Step 1: Register the user
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            role: this.role,
          }),
        });

        const registerData = await res.json();

        if (!res.ok) {
          alert(registerData.msg);
          return;
        }

        // Step 2: Login the user
        const res_login = await fetch(location.origin + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const loginData = await res_login.json();

        if (!res_login.ok) {
          alert(loginData.msg || "Login failed!");
          return;
        }

        console.log("We are Logged In");
        localStorage.setItem("user", JSON.stringify(loginData));
        this.$store.commit("setUser");

        // Step 3: Navigate based on the user's role
        if (this.role === "Customer") {
          this.$router.push("/customerCompleteProfile");
        } else if (this.role === "Professional") {
          this.$router.push("/professionalCompleteProfile");
        }
      } catch (error) {
        console.error("Error during registration or login:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
};

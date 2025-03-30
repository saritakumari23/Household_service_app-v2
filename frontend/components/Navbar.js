export default {
  template: `
    <nav class="navbar navbar-dark bg-dark px-3">
      <router-link class="navbar-brand" to="/">House Hold Service App</router-link>
      <div class="d-flex">
        <router-link class="nav-link text-white" to="/">Home</router-link>
        <router-link v-if="!$store.state.loggedIn" class="nav-link text-white" to="/login">Login</router-link>
        <router-link v-if="!$store.state.loggedIn" class="nav-link text-white" to="/register">Register</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" class="nav-link text-white" to="/admin-dashboard">Admin Dashboard</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" class="nav-link text-white" to="/request">Requests</router-link>

        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" class="nav-link text-white" to="/custProfile">Profile</router-link>

        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" class="nav-link text-white" to="/reqManagement">Dashboard</router-link>
        <button class="btn btn-secondary ms-2" v-if="$store.state.loggedIn" @click="$store.commit('logout')">Logout</button>
      </div>
    </nav>
  `,
};

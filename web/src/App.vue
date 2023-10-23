<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="javascript:void(0)">Gowitness</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/"
              >Home</router-link
            >
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/gallery">Gallery View</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/table"
              >Table View</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/submit"
              >Submit new URL</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/log"
              >Error Log</router-link
            >
          </li>
        </ul>
        
        <div class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
          <router-link class="btn btn-outline-danger mx-1" type="submit" to="/config"><i class="fa-solid fa-gear"></i></router-link>
        </div>
      </div>
    </div>
    <hr />
  </nav>
  <div class="nav-scroller bg-light mb-3 shadow-sm">
    <nav class="nav" aria-label="Secondary navigation">
      <a class="nav-link active" aria-current="page" href="javascript:void(0)"
        >Statistics</a
      >
      <a class="nav-link" href="javascript:void(0)">
        Processed URLs
        <span class="text-bg-light">{{ statistics.URLCount }}</span>
      </a>
      <a class="nav-link" href="javascript:void(0)">
        Certificates
        <span class="text-bg-light">{{ statistics.CertCount }}</span>
      </a>
      <a class="nav-link" href="javascript:void(0)">
        Headers
        <span class="text-bg-light">{{ statistics.HeaderCount }}</span>
      </a>
      <a class="nav-link" href="javascript:void(0)">
        Unique Technologies
        <span class="text-bg-light">{{ statistics.TechCount }}</span>
      </a>
      <!-- <div class="nav-link" href="javascript:void(0)">

      </div> -->
      <!-- <a class="nav-link" href="#">Link</a> -->
    </nav>
  </div>
  <RouterView />
</template>
<script>
import { RouterView, RouterLink } from "vue-router";
import { ref } from "vue";
import axios from "axios";
export default {
  setup() {
    const statistics = ref({});
    return {
      statistics,
    };
  },

  async mounted() {
    const res = await axios.get(`${import.meta.env.VITE_URL || ''}/api/statistic`);
    if (res.status == 200) {
      this.statistics = res.data;
    }
  },
};
</script>

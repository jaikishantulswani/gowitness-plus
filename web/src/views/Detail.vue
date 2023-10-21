<template>
  <div class="mx-3">
    <div class="row align-items-start mb-3">
      <div class="col-sm-12 col-md-4 col-lg-5 col-xl-5">
        <div class="card mb-3">
          <embed
            v-if="url.Data.IsPDF"
            class="card-img-top"
            :src="'/screenshots/' + url.Data.Filename"
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            style="height: 100%; width: 100%"
          />
          <img
            v-else-if="url.Data.Screenshot"
            class="card-img-top"
            :src="'data:image/png;base64,' + url.Data.Screenshot"
            alt=""
            style="height: 100%; width: 100%"
          />
          <img
            v-else
            class="card-img-top"
            loading="lazy"
            :src="'/screenshots/' + url.Data.Filename"
            onerror="this.onerror=null; this.src='/assets/default.jfif'"
            style="height: 100%; width: 100%"
          />

          <div class="card-body">
            <h5 class="card-title">{{ url.Data.Title }}</h5>
            <a class="card-text" :href="url.Data.URL">
              {{ url.Data.URL }}
            </a>
            <!-- <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p> -->
          </div>
        </div>
        <table v-if="url?.Data.Console > 0" class="table caption-top mb-3">
          <caption>
            Console Log
          </caption>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cs, key) in url.Data.Console" :key="key">
              <td>{{ cs.Type }}</td>
              <td>
                <pre>{{ cs.Value }}</pre>
              </td>
            </tr>
          </tbody>
        </table>
        <table v-if="url.Data.TLS" class="table caption-top mb-3">
          <caption>
            TLS Information
          </caption>
          <thead>
            <tr>
              <th scope="col">Subject CN</th>
              <th scope="col">Issuer CN</th>
              <th scope="col">Sig Algorithm</th>
              <th scope="col">DNS Names</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cert, key) in url.Data.TLS.TLSCertificates" :key="key">
              <td>{{ cert.SubjectCommonName }}</td>
              <td>{{ cert.IssuerCommonName }}</td>
              <td>{{ cert.SignatureAlgorithm }}</td>
              <td>
                <ul v-if="cert.DNSNames">
                  <li v-for="dns in cert.DNSNames">"{{ dns.Name }}"</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-sm-12 col-md-8 col-lg-7 col-xl-7">
        <div class="overflow-auto">
          <table class="table caption-top mb-3">
            <caption>
              Response Headers
              <span class="badge bg-primary">Primary</span>
            </caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(header, key) in url.Data.Headers" :key="key">
                <th scope="row">{{ header.Key }}</th>
                <td>{{ header.Value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="overflow-auto">
          <table class="table caption-top mb-3">
            <caption>
              Network Logs
            </caption>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Code</th>
                <th scope="col">IP</th>
                <th scope="col">Error</th>
                <th scope="col">URL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(network, key) in url.Data.Network" :key="key">
                <td>{{ network.RequestType === 1 ? "WS" : "HTTP" }}</td>
                <td>
                  <span
                    v-if="network.StatusCode === 200"
                    class="badge text-bg-success"
                    >{{ network.StatusCode }}</span
                  >
                  <span
                    v-else-if="300 > network.StatusCode > 200"
                    class="badge text-bg-primary"
                    >{{ network.StatusCode }}</span
                  >
                  <!-- <span v-else-if="record.ResponseCode === 404" class="badge text-bg-secondary">{{record.ResponseCode}}</span> -->
                  <span
                    v-else-if="network.StatusCode >= 500"
                    class="badge text-bg-danger"
                    >{{ rnetwork.StatusCode }}</span
                  >
                  <span
                    v-else-if="500 > network.StatusCode >= 400"
                    class="badge text-bg-warning"
                    >{{ network.StatusCode }}</span
                  >
                  <span
                    v-else-if="400 > network.StatusCode >= 300"
                    class="badge text-bg-info"
                    >{{ network.StatusCode }}</span
                  >
                  <span v-else class="badge text-bg-light">{{
                    network.StatusCode
                  }}</span>
                </td>
                <td>{{ network.IP }}</td>
                <td>{{ network.Error }}</td>
                <td>
                  <a :href="network.URL" target="_blank">{{ network.URL }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-header">DOM Dump</div>
      <div class="card-body">
        <pre>{{ url?.Data.DOM }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const url = ref({
      Data: {},
      ID: 0,
      Max: 0,
      Next: 0,
      Previous: 0,
    });
    return {
      url,
    };
  },

  async mounted() {
    const res = await axios.get(
      `http://localhost:7171/api/detail/${this.$route.params.id}`
    );
    if (res.status === 200) {
      this.url = res.data;
    }
  },
};
</script>

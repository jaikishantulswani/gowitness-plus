<template>
  <div class="mx-3">
    <h5>Table view</h5>
  <div class="card ">
    <div class="card-body">
      <table class="table table-hover caption-top table-sm">
        <caption>
          URLS:
          {{
            galleries?.Count ? galleries.Count : 0
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">Probed At</th>
            <th scope="col">Code</th>
            <th scope="col">Orignal URL</th>
            <th scope="col">Final URL</th>
            <th scope="col">Network Logs</th>
            <th scope="col">Console Logs</th>
            <th scope="col">Technologies</th>
            <th scope="col">Title</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, key) in records" ::key="key">
            <td>{{ record.CreatedAt }}</td>
            <td>
              <span
                v-if="record.ResponseCode === 200"
                class="badge text-bg-success"
                >{{ record.ResponseCode }}</span
              >
              <span
                v-else-if="300 > record.ResponseCode > 200"
                class="badge text-bg-primary"
                >{{ record.ResponseCode }}</span
              >
              <!-- <span v-else-if="record.ResponseCode === 404" class="badge text-bg-secondary">{{record.ResponseCode}}</span> -->
              <span
                v-else-if="record.ResponseCode >= 500"
                class="badge text-bg-danger"
                >{{ record.ResponseCode }}</span
              >
              <span
                v-else-if="500 > record.ResponseCode >= 400"
                class="badge text-bg-warning"
                >{{ record.ResponseCode }}</span
              >
              <span
                v-else-if="400 > record.ResponseCode >= 300"
                class="badge text-bg-info"
                >{{ record.ResponseCode }}</span
              >
              <span v-else class="badge text-bg-light">{{
                record.ResponseCode
              }}</span>
            </td>
            <td>
              <a :href="record.URL" target="_blank">{{ record.URL }}</a>
            </td>
            <td>
              <a :href="record.FinalURL" target="_blank">{{
                record.FinalURL
              }}</a>
            </td>
            <td>{{ record.Network.length }}</td>
            <td>{{ record.Console.length }}</td>
            <td>{{ record.Technologies.length }}</td>
            <td>{{ record.Title }}</td>
            <td>
              <router-link class="btn btn btn-outline-primary" aria-current="page" :to="`/detail/${record.ID}`">Detail</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>

</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  setup() {
    const records = ref([]);
    return {
      records,
    };
  },

  async mounted() {
    const res = await axios.get(`${import.meta.env.VITE_URL || ''}/api/table`);
    if (res.status == 200) {
      this.records = res.data.data;
    }
  },
};
</script>

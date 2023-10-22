<template>
        <div class="card mx-3">
            <div class="card-body">
                    <table class="table table-hover caption-top">
                        <caption>List of error</caption>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">URL</th>
                            <th scope="col">ERROR MESSAGE</th>
                            <th scope="col">Date Update</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(log,key) in logs" :key="key">
                            <th scope="row">{{log.ID}}</th>
                            <td>{{log.URL}}</td>
                            <td>{{log.ErrorMsg}}</td>
                            <td>{{log.UpdatedAt}}</td>
                          </tr>
                        </tbody>
                      </table>
            </div></div>


</template>
<script>
import { ref } from 'vue'
import axios from 'axios'
export default {
    setup() {
    const logs = ref([])
    return {
        logs
    }
  },

  async mounted() {
    const res = await axios.get(`${import.meta.env.VITE_URL}/api/log`)
    if(res.status == 200){
       this.logs = res.data.data 
    }
  }
}
</script>
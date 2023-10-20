<template>
    <main class="mx-3">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6 g-3">
        <div v-for="(gallery,key) in galleries.Records" :key="key" class="col">
          <div class="card shadow-sm">
            <embed v-if="gallery.IsPDF" src="'/screenshots/'+gallery.Filename" type="application/pdf" frameBorder="0" scrolling="auto" height="100%" width="100%">
            <img v-else-if="gallery.Screenshot" :src="'data:image/png;base64,'+ gallery.Screenshot" alt="" class="card-img-top">
            <img v-else loading="lazy" :src="'/screenshots/'+ gallery.Filename"
                onerror="this.onerror=null; this.src='/assets/default.jfif'" class="card-img-top"/>
            <div class="card-body">
              <div><a :href="gallery.URL" target="_blank">{{ gallery.URL }}</a></div>
              <div class="text-muted">{{ gallery.Title }}</div>
              <div v-for="(technologie,tkey) in gallery.Technologies" :key="tkey">
                
                <span class="badge text-bg-primary">{{ technologie.Value}}</span>

              </div>
            </div>
            <div class="card-footer text-body-secondary">
              <button class="btn btn-primary">Go</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="galleries.Count > 0 || galleries.page > 1" class="d-flex my-3">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">Previous</a></li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">Next</a></li>
          </ul>
        </nav>
      </div>
    </main>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
export default {
    setup() {
    const galleries = ref([])
    return {
      galleries
    }
  },

  async mounted() {
    const res = await axios.get('http://localhost:7171/api/gallery')
    if(res.status == 200){
       this.galleries = res.data.data 
    }
  }
}
</script>
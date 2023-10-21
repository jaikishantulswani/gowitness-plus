<template>
  <main class="mx-3">
    <h5>Gallery view</h5>
    <small class="text-muted"
      >URLS: {{ galleries?.Count ? galleries.Count : 0 }}</small
    >
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6 g-3">
      <div v-for="(gallery, key) in galleries.Records" :key="key" class="col">
        <div class="card shadow-sm">
          <embed
            v-if="gallery.IsPDF"
            :src="'/screenshots/' + gallery.Filename"
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            height="100%"
            width="100%"
            @click="selectGallery(gallery)"
          />
          <img
            v-else-if="gallery.Screenshot"
            :src="'data:image/png;base64,' + gallery.Screenshot"
            alt=""
            class="card-img-top"
            @click="selectGallery(gallery)"
          />
          <img
            v-else
            loading="lazy"
            :src="'/screenshots/' + gallery.Filename"
            onerror="this.onerror=null; this.src='/assets/default.jfif'"
            class="card-img-top"
            @click="selectGallery(gallery)"
          />
          <div class="card-body">
            <div>
              <a :href="gallery.URL" target="_blank">{{ gallery.URL }}</a>
            </div>
            <div class="text-muted">{{ gallery.Title }}</div>
            <div
              v-for="(technologie, tkey) in gallery.Technologies"
              :key="tkey"
            >
              <span class="badge text-bg-primary">{{ technologie.Value }}</span>
            </div>
          </div>
          <div class="card-footer text-body-secondary">
            <router-link class="btn btn-primary" aria-current="page" :to="`/detail/${gallery.ID}`">Go</router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-if="galleries.Count > 0 || galleries.page > 1" class="d-flex justify-content-end my-3">
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
  <div
    :class="modal ? 'modal fade show' : 'modal'"
    id="exampleModalXl"
    tabindex="-1"
    aria-labelledby="exampleModalXlLabel"
    :style="modal ? 'display: block' : 'display: none'"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title h4" id="exampleModalXlLabel">
            {{ url }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="modal = false"
          ></button>
        </div>
        <div class="modal-body">
          <embed
            v-if="galleryS.IsPDF"
            :src="'/screenshots/' + galleryS.Filename"
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            style="height: 100%;width: 100%;"
          />
          <img
            v-else-if="galleryS.Screenshot"
            :src="'data:image/png;base64,' + galleryS.Screenshot"
            alt=""
            style="height: 100%;width: 100%;"
          />
          <img
            v-else
            loading="lazy"
            :src="'/screenshots/' + galleryS.Filename"
            onerror="this.onerror=null; this.src='/assets/default.jfif'"
            style="height: 100%;width: 100%;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { watch } from 'vue';
import { useMagicKeys } from "@vueuse/core";
export default {
  setup() {
    const galleries = ref({});
    const url = ref("");
    const galleryS = ref({});
    const modal = ref(false);
    const { escape } = useMagicKeys();
    function selectGallery(gallery) {
      modal.value = true;
      galleryS.value = gallery;
    }

    watch(escape, (v) => {
      if (v) {
        modal.value = false
      }
    });

    return {
      modal,
      galleries,
      url,
      galleryS,

      selectGallery,
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:7171/api/gallery");
    if (res.status == 200) {
      this.galleries = res.data.data;
    }
  },
};
</script>

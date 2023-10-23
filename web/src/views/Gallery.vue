<template>
  <main class="mx-3">
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td>
            <h5>Gallery view</h5>
          </td>
          <td>
            <div class="form-check form-switch">
              <input
                v-model="perception"
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault"
                >Enable perception sort</label
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>

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
            <router-link
              class="btn btn-primary mx-1"
              aria-current="page"
              :to="`/detail/${gallery.ID}`"
              ><i class="fa-regular fa-eye"></i
            ></router-link>
            <a
            v-if="gallery.Callback"
              class="btn btn-warning mx-1"
              aria-current="page"
              :href="`${gallery.Callback}/url/${gallery.IdUrl}`"
              target="_blank"
              ><i class="fa-regular fa-circle-up"></i
            ></a>
            <button
            v-if="gallery.Callback"
              class="btn btn-info mx-1"
              @click="updateLabel(gallery.Callback, gallery.IdUrl)"
            >
              <i class="fa-solid fa-tag"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="galleries.Count > 0 || galleries.page > 1"
      class="d-flex justify-content-end my-3"
    >
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li
            :class="galleries.Page > 1 ? 'page-item' : 'page-item disabled'"
            @click="prevPage()"
          >
            <a class="page-link" href="javascript:void(0)">Previous</a>
          </li>
          <li v-for="i in galleries.PrevPageRange" class="page-item">
            <a
              class="page-link"
              href="javascript:void(0)"
              @click="goToPage(i)"
              >{{ i }}</a
            >
          </li>
          <li class="page-item">
            <a class="page-link" href="javascript:void(0)">{{
              galleries.Page
            }}</a>
          </li>
          <li v-for="i in galleries.NextPageRange" class="page-item">
            <a
              class="page-link"
              href="javascript:void(0)"
              @click="goToPage(i)"
              >{{ i }}</a
            >
          </li>
          <li
            :class="
              galleries.Page === galleries.NextPage
                ? 'page-item disabled'
                : 'page-item'
            "
            @click="nextPage()"
          >
            <a class="page-link" href="javascript:void(0)">Next</a>
          </li>
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
            {{ galleryS.URL }}
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
            style="height: 100%; width: 100%"
          />
          <img
            v-else-if="galleryS.Screenshot"
            :src="'data:image/png;base64,' + galleryS.Screenshot"
            alt=""
            style="height: 100%; width: 100%"
          />
          <img
            v-else
            loading="lazy"
            :src="'/screenshots/' + galleryS.Filename"
            onerror="this.onerror=null; this.src='/assets/default.jfif'"
            style="height: 100%; width: 100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { useToast } from 'vue-toastification'
export default {
  setup() {
    const galleries = ref({});
    const toast = useToast();
    const url = ref("");
    const galleryS = ref({});
    const modal = ref(false);
    const perception = ref(false);
    const perceptionLocal = localStorage.getItem("perception");
    if(!perceptionLocal){
      localStorage.setItem("perception", false);
    }
    else if (
      perceptionLocal.toLowerCase() === "true" ||
      perceptionLocal.toLowerCase() === "false"
    ) {
      perception.value = perceptionLocal.toLowerCase() === "true";
    } else {
      localStorage.setItem("perception", false);
    }
    const { escape } = useMagicKeys();
    function selectGallery(gallery) {
      modal.value = true;
      galleryS.value = gallery;
    }

    const prevPage = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ''}/api/gallery?perception_sort=${perception.value}&limit=${galleries.value.Limit}&page=${galleries.value.PrevPage}`
      );
      if (res.status == 200) {
        galleries.value = res.data.data;
      }
    };

    const nextPage = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ''}/api/gallery?perception_sort=${perception.value}&limit=${galleries.value.Limit}&page=${galleries.value.NextPage}`
      );
      if (res.status == 200) {
        galleries.value = res.data.data;
      }
    };

    const goToPage = async (page) => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ''}/api/gallery?perception_sort=${perception.value}&limit=${galleries.value.Limit}&page=${page}`
      );
      if (res.status == 200) {
        galleries.value = res.data.data;
      }
    };

    const updateLabel = async (callback, idUrl) => {
      if(!callback){
        toast.error('Callback is empty')
        return
      }
      const res = await axios.post(
        `${callback}/api/callback/url/update-label`,
        {
          idUrl,
          label: 0,
        }
      ).catch(error => {return false});
      if(!res || res.error){
        toast.error('Unknow error')
      }else{
        toast.success("Success");
      }
    };

    watch(escape, (v) => {
      if (v) {
        modal.value = false;
      }
    });

    watch(perception, (v) => {
      localStorage.setItem("perception", v);
    });

    return {
      modal,
      galleries,
      url,
      galleryS,
      perception,
      toast,

      selectGallery,
      prevPage,
      nextPage,
      goToPage,
      updateLabel,
    };
  },

  async mounted() {
    const res = await axios.get(
      `${import.meta.env.VITE_URL || ''}/api/gallery?perception_sort=${
        this.perception
      }`
    );
    if (res.status == 200) {
      this.galleries = res.data.data;
    }
  },
};
</script>

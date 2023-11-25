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
          <td>
            <div class="form-check form-switch">
              <input
                v-model="hidden"
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault"
                >Don't show hidden</label
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
            :src="'data:image/pngbase64,' + gallery.Screenshot"
            alt=""
            class="card-img-top"
            @click="selectGallery(gallery)"
          />
          <img
            v-else
            loading="lazy"
            :src="'/screenshots/' + gallery.Filename"
            onerror="this.onerror=null;this.src='/default.jfif'"
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
              class="btn btn-primary m-1"
              aria-current="page"
              :to="`/detail/${gallery.ID}`"
              ><i class="fa-regular fa-memo"></i></router-link>
            <a
              v-if="gallery.Callback"
              class="btn btn-warning m-1"
              aria-current="page"
              :href="`${gallery.Callback}/url/${gallery.IdUrl}`"
              target="_blank"
              ><i class="fa-regular fa-circle-up"></i
            ></a>
            <a
            v-if="gallery.Callback"
            class="btn btn-info m-1"
            aria-current="page"
            @click="bookmarkdUrl(gallery.Callback, gallery.IdUrl)"
            target="_blank"
            ><i class="fa-regular fa-bookmark"></i></a>
            <a
            class="btn btn-secondary m-1"
            aria-current="page"
            @click="hiddenUrl(gallery.ID,!gallery.Hidden)"
            target="_blank"
            ><i :class="gallery.Hidden ? 'fa-regular fa-eye-slash': 'fa-regular fa-eye'"></i></a>
            <div v-if="gallery.Callback" class="btn-group m-1">
              <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" @click="getLabels(gallery.Callback)">
                Update Label
              </button>
              <ul class="dropdown-menu">
                <li v-for="(lb,lbkey) in labels" :key="lbkey"><a class="dropdown-item" href="javascript:void(1)" @click="updateLabel(gallery.Callback, gallery.IdUrl,lb)">{{lb}}</a></li>
              </ul>
            </div>
            <div v-if="gallery.Callback" class="btn-group m-1">
              <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" @click="getAgents(gallery.Callback)">
                Run Agent
              </button>
              <ul class="dropdown-menu">
                <li v-for="(ag,lbkey) in agents" :key="lbkey"><a class="dropdown-item" href="javascript:void(1)" @click="runAgent(gallery.Callback, gallery.IdUrl,ag.id)">{{ag.name}}</a></li>
              </ul>
            </div>
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
            <a class="page-link active" href="javascript:void(0)">{{
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
            class="cusimg"
          />
          <img
            v-else-if="galleryS.Screenshot"
            :src="'data:image/pngbase64,' + galleryS.Screenshot"
            alt=""
            class="cusimg"
          />
          <img
            v-else
            loading="lazy"
            :src="'/screenshots/' + galleryS.Filename"
            onerror="this.onerror=null;this.src='/default.jfif'"
            class="cusimg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import axios from "axios"
import { watch } from "vue"
import { useMagicKeys } from "@vueuse/core"
import { useToast } from "vue-toastification"
export default {
  setup() {
    const galleries = ref({})
    const toast = useToast()
    const url = ref("")
    const galleryS = ref({})
    const modal = ref(false)
    const perception = ref(false)
    const configs = ref([])
    const callbacks = ref([])
    const labels = ref([])
    const agents = ref([])
    const hidden = ref(true)

    const perceptionLocal = localStorage.getItem("perception")
    if (!perceptionLocal) {
      localStorage.setItem("perception", false)
    } else if (
      perceptionLocal.toLowerCase() === "true" ||
      perceptionLocal.toLowerCase() === "false"
    ) {
      perception.value = perceptionLocal.toLowerCase() === "true"
    } else {
      localStorage.setItem("perception", false)
    }

    const hiddenLocal = localStorage.getItem("hidden")
    if (!hiddenLocal) {
      localStorage.setItem("hidden", true)
    } else if (
      hiddenLocal.toLowerCase() === "true" ||
      hiddenLocal.toLowerCase() === "false"
    ) {
      hidden.value = hiddenLocal.toLowerCase() === "true"
    } else {
      localStorage.setItem("hidden", false)
    }

    const { escape } = useMagicKeys()
    const selectGallery = (gallery) => {
      modal.value = true
      galleryS.value = gallery
    }

    const getLabels = (m) => {
      const rs = callbacks.value.find(({machine}) => machine === m)
      if(rs){
        labels.value = rs.labels
      }
      
    }

    const getAgents = (m) => {
      const rs = callbacks.value.find(({machine}) => machine === m)
      if(rs){
        agents.value = rs.agents
      }
    }

    const updateData = async () => {
      let res = await axios.get(
        `${import.meta.env.VITE_URL || ""}/api/gallery?perception_sort=${
          perception.value
        }&hidden=${hidden.value}`
      )
      if (res.status == 200) {
        galleries.value = res.data.data
      }
      res = await axios.get(`${import.meta.env.VITE_URL || ""}/api/config/get`)
      if (res.status == 200) {
        configs.value = res.data.data
      }
    }

    const prevPage = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ""}/api/gallery?perception_sort=${
          perception.value
        }&limit=${galleries.value.Limit}&page=${galleries.value.PrevPage}`
      )
      if (res.status == 200) {
        galleries.value = res.data.data
      } else if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      }
    }

    const nextPage = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ""}/api/gallery?perception_sort=${
          perception.value
        }&limit=${galleries.value.Limit}&page=${galleries.value.NextPage}`
      )
      if (res.status == 200) {
        galleries.value = res.data.data
      } else if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      }
    }

    const goToPage = async (page) => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ""}/api/gallery?perception_sort=${
          perception.value
        }&limit=${galleries.value.Limit}&page=${page}`
      )
      if (res.status == 200) {
        galleries.value = res.data.data
      } else if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      }
    }

    const updateLabel = async (callback, idUrl,label) => {
      if (!callback) {
        toast.error("Callback is empty")
        return
      }
      const APIKey = configs.value.find((c) => c.Machine === callback)
      if(!APIKey){
        toast.error(`API key for machine ${callback} is not found`)
        return
      }
      const res = await axios
        .post(
          `${callback}/api/callback/url/update-label`,
          {
            idUrl,
            label,
          },
          {
            headers: {
              "x-api-key": APIKey.Value,
            },
          }
        )
        .catch((error) => {
          return false
        })
      if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      } else {
        toast.success("Success")
      }
    }

    const runAgent = async (callback, idUrl,idAgent) => {
      if (!callback) {
        toast.error("Callback is empty")
        return
      }
      const APIKey = configs.value.find((c) => c.Machine === callback)
      if(!APIKey){
        toast.error(`API key for machine ${callback} is not found`)
        return
      }
      const res = await axios
        .post(
          `${callback}/api/callback/url/run-agent`,
          {
            idUrl,
            idAgent,
          },
          {
            headers: {
              "x-api-key": APIKey.Value,
            },
          }
        )
        .catch((error) => {
          return false
        })
      if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      } else {
        toast.success("Success")
      }
    }

    const bookmarkdUrl = async (callback, idUrl) => {
      if (!callback) {
        toast.error("Callback is empty")
        return
      }
      const APIKey = configs.value.find((c) => c.Machine === callback)
      if(!APIKey){
        toast.error(`API key for machine ${callback} is not found`)
        return
      }
      const res = await axios
        .post(
          `${callback}/api/callback/url/bookmark`,
          {
            idUrl,
          },
          {
            headers: {
              "x-api-key": APIKey.Value,
            },
          }
        )
        .catch((error) => {
          return false
        })
      if (!res || res?.data.error) {
        toast.error(res?.data?.error || "Unknow error")
      } else {
        toast.success("Success")
      }
    }

    const hiddenUrl = async(id,hidden) =>{
      console.log(hidden)
      const res = await axios.post(
        `${import.meta.env.VITE_URL || ""}/api/url/hidden`,
        {
          id,
          hidden
        }
      );
      if (!res || res?.data.error) {
        toast.error(res?.data?.error || 'Unknow error')
      }else if (res?.data.status) {
        toast.success("Success");
        await updateData()
      }
    }

    watch(escape, (v) => {
      if (v) {
        modal.value = false
      }
    })
    watch(perception, (v) => {
      localStorage.setItem("perception", v)
    })
    watch(hidden, (v) => {
      localStorage.setItem("hidden", v)
    })

    return {
      modal,
      galleries,
      url,
      galleryS,
      perception,
      toast,
      configs,
      callbacks,
      labels,
      agents,
      hidden,

      updateData,
      getLabels,
      getAgents,
      selectGallery,
      prevPage,
      nextPage,
      goToPage,
      updateLabel,
      runAgent,
      bookmarkdUrl,
      hiddenUrl,
    }
  },

  async mounted() {
    await this.updateData()
    for(const c of this.configs){
      if(c.Machine && c.Machine.length > 0){
        const res = await axios.get(
        `${c.Machine}/api/callback/get-config`,{
            headers: {
              "x-api-key": c.Value,
            },
          }
        ).catch((error) => {
          return false
        })
      if (!res || res?.data.error) {
        this.toast.error(res?.data?.error || "Unknow error")
      } else if (res?.data.success) {
          const rs = {
            machine: c.Machine,
            labels: res.data.success.labels,
            agents: res.data.success.agents,
          }
          this.callbacks.push(rs)
        }
      }
    }
  },
}
</script>

<style scoped>
.cusimg{
  width: 100%;
  height: 100%;
}

</style>
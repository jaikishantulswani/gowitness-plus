<template>
  <main class="container">
    <div class="py-5 text-center">
      <h2>Checkout form</h2>
      <p class="lead">
        Below is an example form built entirely with Bootstrap’s form controls.
        Each required form group has a validation state that can be triggered by
        attempting to submit the form without completing it.
      </p>
    </div>

    <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Your cart</span>
          <span class="badge bg-primary rounded-pill">3</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">Product name</h6>
              <small class="text-muted">Brief description</small>
            </div>
            <span class="text-muted">$12</span>
          </li>
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">Second product</h6>
              <small class="text-muted">Brief description</small>
            </div>
            <span class="text-muted">$8</span>
          </li>
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">Third item</h6>
              <small class="text-muted">Brief description</small>
            </div>
            <span class="text-muted">$5</span>
          </li>
          <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success">
              <h6 class="my-0">Promo code</h6>
              <small>EXAMPLECODE</small>
            </div>
            <span class="text-success">−$5</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>$20</strong>
          </li>
        </ul>

        <form class="card p-2">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Promo code" />
            <button type="submit" class="btn btn-secondary">Redeem</button>
          </div>
        </form>
      </div>
      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Billing address</h4>
        <form class="needs-validation">
          <div
            v-for="(config, key) in configs"
            :key="key"
            class="input-group my-1"
          >
            <span class="input-group-text">{{ config.Key }}</span>
            <input
              v-model="config.Machine"
              type="text"
              aria-label="First name"
              class="form-control"
            />
            <input
              v-model="config.Value"
              type="text"
              aria-label="Last name"
              class="form-control"
            />
            <button
              class="btn btn-outline-warning"
              type="button"
              id="button-addon2"
              @click="updateKey(config)"
            >
              Update
            </button>
            <button
              class="btn btn-outline-danger"
              type="button"
              id="button-addon2"
              @click="deleteKey(config.ID)"
            >
              Delete
            </button>
          </div>

          <hr class="my-4" />

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="same-address" />
            <label class="form-check-label" for="same-address"
              >Shipping address is the same as my billing address</label
            >
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="save-info" />
            <label class="form-check-label" for="save-info"
              >Save this information for next time</label
            >
          </div>

          <hr class="my-4" />

          <h4 class="mb-3">Payment</h4>

          <div class="my-3">
            <div class="form-check">
              <input
                id="credit"
                name="paymentMethod"
                type="radio"
                class="form-check-input"
              />
              <label class="form-check-label" for="credit">Credit card</label>
            </div>
            <div class="form-check">
              <input
                id="debit"
                name="paymentMethod"
                type="radio"
                class="form-check-input"
              />
              <label class="form-check-label" for="debit">Debit card</label>
            </div>
            <div class="form-check">
              <input
                id="paypal"
                name="paymentMethod"
                type="radio"
                class="form-check-input"
              />
              <label class="form-check-label" for="paypal">PayPal</label>
            </div>
          </div>

          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-name" class="form-label">Name on card</label>
              <input
                type="text"
                class="form-control"
                id="cc-name"
                placeholder=""
              />
              <small class="text-muted">Full name as displayed on card</small>
              <div class="invalid-feedback">Name on card is required</div>
            </div>

            <div class="col-md-6">
              <label for="cc-number" class="form-label"
                >Credit card number</label
              >
              <input
                type="text"
                class="form-control"
                id="cc-number"
                placeholder=""
              />
              <div class="invalid-feedback">Credit card number is required</div>
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input
                type="text"
                class="form-control"
                id="cc-expiration"
                placeholder=""
              />
              <div class="invalid-feedback">Expiration date required</div>
            </div>

            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input
                type="text"
                class="form-control"
                id="cc-cvv"
                placeholder=""
              />
              <div class="invalid-feedback">Security code required</div>
            </div>
          </div>

          <hr class="my-4" />

          <button class="w-100 btn btn-primary btn-lg" type="submit">
            Continue to checkout
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useToast } from 'vue-toastification'
export default {
  setup() {
    const configs = ref([]);
    const toast = useToast();

    const updateData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL || ""}/api/config/get`
      );
      if (res.status == 200) {
        configs.value = res.data.data;
      }
    };

    const updateKey = async (config) => {
      const res = await axios.post(
        `${import.meta.env.VITE_URL || ""}/api/config/set`,
        {
          id: config.ID,
          Machine: config.Machine,
          Value: config.Value,
        }
      );
      if (res.status == 200) {
        toast.success("Success");
        await updateData()
      }else if (!res || res?.data.error) {
        toast.error(res?.data?.error || 'Unknow error')
      }
    };
    const deleteKey = async (id) => {
      const res = await axios.post(
        `${import.meta.env.VITE_URL || ""}/api/config/delete`,
        {
          id,
        }
      );
      if (res.status == 200) {
        toast.success("Success");
        await updateData()
      }else if (!res || res?.data.error) {
        toast.error(res?.data?.error || 'Unknow error')
      }
    };
    return {
      configs,
      toast,

      updateData,
      updateKey,
      deleteKey,
    };
  },

  async mounted() {
    await this.updateData()
  },
};
</script>

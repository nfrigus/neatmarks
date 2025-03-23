<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <div class="wrapper">
          <h2>Bookmarks ordering</h2>
          <form @submit.prevent="onSubmit()">
            <dl>
              <dt><label>Order by</label></dt>
              <dd>
                <select v-model="orderBy" name="options.orderBy">
                  <option value="none" style="font-style: italic">
                    disable
                  </option>
                  <option value="alpha">
                    Title: A > Z
                  </option>
                  <option value="alphaReverse">
                    Title: Z > A
                  </option>
                  <option value="date">
                    Date Added: Newer > Older
                  </option>
                  <option value="dateReverse">
                    Date Added: Older > Newer
                  </option>
                  <option value="url">
                    URL: A > Z
                  </option>
                  <option value="urlReverse">
                    URL: Z > A
                  </option>
                </select>
              </dd>
              <template v-if="orderBy !== 'none'">
                <dt><label>Delay ordering, seconds</label></dt>
                <dd>
                  <input
                    v-model="orderDelay"
                    class="form-control"
                    html-type="number"
                    name="options.orderDelay"
                  />
                </dd>
              </template>
            </dl>
            <button type="submit">
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
  function sendMessage(msg) {
    return new Promise(resolve => chrome.runtime.sendMessage(msg, resolve))
  }

  export default {
    data() {
      return {
        orderBy: 'none',
        orderDelay: 0,
      }
    },
    async mounted() {
      await this.load()
    },
    methods: {
      async load() {
        return Object.assign(this, await sendMessage({ request: 'options.get' }))
      },
      async save() {
        return sendMessage({
          request: 'options.set',
          option: {
            orderBy: this.orderBy,
            orderDelay: this.orderDelay,
          },
        })
      },
      async onSubmit() {
        await this.save()
      },
    },
  }
</script>

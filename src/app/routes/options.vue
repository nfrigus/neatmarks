<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <div class="wrapper">
          <h2>Bookmarks ordering</h2>
          <form @submit.prevent="onSubmit()">
            <div class="form-group">
              <label>Order by</label>
              <Select v-model="orderBy" name="options.orderBy">
                <Option value="none" style="font-style: italic">
                  disable
                </Option>
                <OptionGroup label="Title">
                  <Option value="alpha">
                    A > Z
                  </Option>
                  <Option value="alphaReverse">
                    Z > A
                  </Option>
                </OptionGroup>
                <OptionGroup label="Date Added">
                  <Option value="date">
                    Newer > Older
                  </Option>
                  <Option value="dateReverse">
                    Older > Newer
                  </Option>
                </OptionGroup>
                <OptionGroup label="URL">
                  <Option value="url">
                    A > Z
                  </Option>
                  <Option value="urlReverse">
                    Z > A
                  </Option>
                </OptionGroup>
              </Select>
            </div>
            <div v-if="orderBy !== 'none'" class="form-group">
              <label>Delay ordering, seconds</label>
              <Input v-model="orderDelay" html-type="number"
                class="form-control" name="options.orderDelay"
              />
            </div>
            <Button html-type="submit" type="primary">
              Save
            </Button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  const { sendMessage } = window.chrome.extension


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
        return Object.assign(this, await new Promise(resolve => sendMessage({ request: 'options.get' }, resolve)))
      },
      async save() {
        return new Promise(resolve => sendMessage({
          request: 'options.set',
          option: {
            orderBy: this.orderBy,
            orderDelay: this.orderDelay,
          },
        }, resolve))
      },
      async onSubmit() {
        await this.save()
        this.$Message.info('Saved.')
      },
    },
  }
</script>

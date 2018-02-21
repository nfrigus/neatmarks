<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <h1>Neatmarks</h1>

        <div class="wrapper">
          <h2>Autosorting</h2>

          <form @submit.prevent="onSubmit()">
            <div class="form-check">
              <label class="form-check-label">
                <Switch v-model="options.enabled" />
                enable bookmarks autosorting
              </label>
            </div>
            <div class="form-group">
              <label>Sorting order</label>
              <Select v-model="options.order_by">
                <Option value="">...</Option>
                <OptionGroup label="Alpha">
                  <Option value="alpha">A-Z</Option>
                  <Option value="alphaReverse">Z-A</Option>
                </OptionGroup>
                <OptionGroup label="Date Added">
                  <Option value="date">Newer - Older</Option>
                  <Option value="dateReverse">Older - Newer</Option>
                </OptionGroup>
                <OptionGroup label="URL">
                  <Option value="url">A-Z</Option>
                  <Option value="urlReverse">Z-A</Option>
                </OptionGroup>
              </Select>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <Switch v-model="options.create_delay" />
                enable sorting delay
              </label>
            </div>
            <div class="form-group">
              <label>Sorting delay interval</label>
              <Input type="number" class="form-control" v-model="options.create_delay_detail" />
            </div>
            <Button html-type="submit" type="primary">Save</Button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  async function getOptions() {
    return new Promise(resolve => chrome.extension.sendMessage({ 'request': 'options' }, resolve))
  }
  async function setOptions(option) {
    return new Promise(resolve => chrome.extension.sendMessage({ request: 'options_set', option }, resolve))
  }


  export default {
    async mounted() {
      this.options = await getOptions()
    },
    data() {
      return {
        options: {
          create_delay: true,
          create_delay_detail: 30,
          enabled: false,
          order_by: "alpha",
        },
      }
    },
    methods: {
      async onSubmit() {
        await setOptions(this.options)
        this.$Message.info('Saved.');
      },
    },
  }
</script>

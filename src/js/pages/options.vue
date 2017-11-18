<template>
  <div class="container-fluid">
    <div class="row">
      <main role="main" class="col-sm-9 ml-sm-auto mr-sm-auto col-md-10 pt-3 pb-3">
        <h1>Neatmarks</h1>

        <div class="wrapper">
          <h2>Autosorting</h2>

          <form id="options-form">
            <div class="form-check">
              <label class="form-check-label">
                <input
                  type="checkbox"
                  class="form-check-input"
                  data-option="enabled">
                enable bookmarks autosorting
              </label>
            </div>
            <div class="form-group">
              <label for="option-autosorting-order">Sorting order</label>
              <select data-option="order_by" class="form-control" id="option-autosorting-order">
                <option value="">...</option>
                <optgroup label="Alpha">
                  <option value="alpha">A-Z</option>
                  <option value="alphaReverse">Z-A</option>
                </optgroup>
                <optgroup label="Date Added">
                  <option value="date">Newer - Older</option>
                  <option value="dateReverse">Older - Newer</option>
                </optgroup>
                <optgroup label="URL">
                  <option value="url">A-Z</option>
                  <option value="urlReverse">Z-A</option>
                </optgroup>
              </select>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" data-option="create_delay">
                enable sorting delay
              </label>
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">Sorting delay interval</label>
              <input type="number" class="form-control" id="exampleFormControlInput1" data-option="create_delay_detail">
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import OptionHandler from './options'


  export default {
    mounted() {
      OptionHandler.init()
    },
  }
</script>

var vm = new Vue({
  el: '#slider',
  data: {
    minAngle: 10,
    maxAngle: 30
  },
  computed: {
    sliderMin: {
      get: function() {
        var val = parseInt(this.minAngle);
        return val;
      },
      set: function(val) {
        val = parseInt(val);
        if (val > this.maxAngle) {
          this.maxAngle = val;
        }
        this.minAngle = val;
      }
    },
    sliderMax: {
      get: function() {
        var val = parseInt(this.maxAngle);
        return val;
      },
      set: function(val) {
        val = parseInt(val);
        if (val < this.minAngle) {
          this.minAngle = val;
        }
        this.maxAngle = val;
      }
    }
  }
});
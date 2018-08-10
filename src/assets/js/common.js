var mixin={
  name: "common",
  methods:{
    alertInfo(msg,type){
      this.$notify({
        title: '',
        message: msg,
        type: type||""
      });
    }
  }
};
export default mixin;

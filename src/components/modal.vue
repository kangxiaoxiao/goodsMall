<template>
    <div class="modalWrapper">
      <el-dialog
        :title="modalTitle"
        :visible.sync="modelShow"
        width="30%"
        center
        @close="closeModel"
      >
        <div class="loginBoxCon">
          <slot name="boxCon"></slot>
        </div>
        <span slot="footer" class="dialog-footer">
          <slot name="footerBtn"></slot>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "modal",
        props: ['modalTitle',"modelVisible"],
        data(){
          return {
            modelShow:false
          }
        },
        mounted:function(){

        },
        methods:{
          closeModel(){
            this.$emit("closeModel",false)
          }
        },
      watch:{
          "modelVisible":function(val,old){
            this.modelShow=val
          }
      }
    }
</script>

<style scoped>

</style>

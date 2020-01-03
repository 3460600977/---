<template>
  <div class="screen-type-preview-content">
    <MyRadio
      :disabled="disabled"
      v-for="(item, index) in projectConst.screenType"
      @click.native="disabled ? null : screenType = item; $emit('changeScreenType', item)"
      :active="screenType === item"
      :key="index">
      <span class="float-left">{{item.name}}</span>
      <div class="float-left screen-preview">
        <div class="top bg-gray" :class="{'disabled': disabled}">
          <el-image
            v-if="item.value != '002'"
            style="width: 100%; height: 100%"
            :src="screenPlaceholder.top"
            fit="cover"></el-image>
          <el-image
            v-else
            style="width: 100%; height: 100%"
            :src="screenPlaceholder.topEmpty"
            fit="cover"></el-image>
        </div>
        <div class="bottom bg-gray" :class="{'disabled': disabled}">
          <el-image
            v-if="item.value != '001'"
            style="width: 100%; height: 100%"
            :src="screenPlaceholder.bottom"
            fit="cover"></el-image>
          <el-image
            v-else
            style="width: 100%; height: 100%"
            :src="screenPlaceholder.bottomEmpty"
            fit="cover"></el-image>
        </div>
      </div>
    </MyRadio>
  </div>
</template>

<script>
import { projectConst } from '@/utils/static'
import MyRadio from '@/components/MyRadio'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  components: {
    MyRadio
  },

  data() {
    return {
      projectConst,

      screenType: projectConst.screenType[0],

      screenPlaceholder: {
        top: require('@/assets/images/bg_shang.png'),
        topEmpty: require('@/assets/images/bg_shang_empty.png'),
        bottom: require('@/assets/images/bg_xia.png'),
        bottomEmpty: require('@/assets/images/bg_xia_empty.png')
      },
    }
  },

}
</script>

<style lang="scss" scoped>
.screen-type-preview-content{
  margin-top: -100px;
  .screen-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-top: 100px;
    width:80px;
    height:180px;
    background: #000000;
    border:1px solid rgba(196, 196, 196, 0.8);
    box-shadow:0px 2px 6px 1px rgba(19,18,18,0.1);
    border-radius:6px;
    .disabled{
      filter:opacity(0.4);
    }
    >.bg-gray{
      background:#DBDBDB !important;
    }
    .top{
      width:70px;
      height:123px;
    }
    .bottom{
      width:70px;
      height:40px;
      margin-top: 5px;
    }
  }
}
</style>

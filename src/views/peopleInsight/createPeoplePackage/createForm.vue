<template>
  <div class="form">
    <el-form label-position="top" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="人群包名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="人群包描述：" style="margin-bottom: 30px">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <router-link to="/peopleInsight">
          <el-button @click="backToList">取消</el-button>
        </router-link>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapMutations, mapState} from "vuex";

  export default {
    name: "createForm",
    data() {
      return {
        rules: {
          name: [
            {required: true, message: '请输入人群包名称', trigger: 'blur'}
          ],
        },
        form: {
          name: '',
          description: '',
          tags: '',
          tagsName: '',
          city: ''
        },
      }
    },
    methods: {
      ...mapMutations(["removeAllState"]),
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            //拼接数据
            //1 拼接tid  用于后台调用酷云
            //2 拼接tagnames  用于人群分析的展示
            //3 拼接city  分别在列表页以及人群分析展示(城市的名称)
            let city = "";
            let childTids = "";
            this.crowdProject.tagNames.forEach((tags,index)=>{
              if (tags.tid === this.crowdProject.cityTid) {
                city = tags.tags[0].name;
              }
              childTids += "(";
                tags.tags.forEach((tagInfo,tagIndex)=>{
                childTids += tagInfo.tid;
                if (tagIndex < tags.tags.length-1) {
                  childTids += "|";
                }
              });
              childTids += ")";
              if (index < this.crowdProject.tagNames.length-1){
                childTids += ",";
              }
            });

            if (city === ""){
              this.$message({
                type: 'warning',
                message: '城市必选'
              });
              return false;
            }
            this.form.tags = childTids;
            this.form.tagsName = JSON.stringify(this.crowdProject.tagNames);
            this.form.city = city;
            const h = this.$createElement;
            this.$msgbox({
              title: '是否创建人群包？',
              message: h('p', null, [
                h('span', null, '生成人群需要一定的时间，请您耐心等待！'),
                h('span', null, '生成100万以下的人群在'),
                h('i', { style: 'color: red' }, '2个小时'),
                h('span', null, '之内完成； 生成100万以上的人群至少需要'),
                h('i', { style: 'color: red' }, '8个小时'),
                h('span', null, '完成；'),
                h('span', null, '生成完后，可以在“媒体智选”页面，利用人群包进行选点'),
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.$api.peopleInsight.createPeopleCrowd(this.form)
                .then(res => {
                  this.removeAllState();
                  //跳转至列表页
                  this.$router.push('/peopleInsight');
                })
                .catch(res => {
                  this.$message({
                    type: 'info',
                    message: '保存失败'
                  })
                })
            }).catch(action=>{

            });
          } else {
            return false;
          }
        });
      },
      backToList(){
        this.removeAllState();
        //跳转至列表页
        this.$router.push('/peopleInsight');
      },
    },
    computed:{
      ...mapState(["crowdProject"])
    }
  }
</script>

<style scoped lang='scss'>
  .form {
    padding: 15px 30px;
    .el-input {
      width: 260px;
    }
    .el-button {
      width: 100px;
    }
    & /deep/ .el-textarea__inner {
      width:260px;
      height:90px;
    }
    .el-button + .el-button {
      margin-left: 60px;
    }
  }
</style>

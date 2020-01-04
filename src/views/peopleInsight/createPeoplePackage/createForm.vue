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
        <el-button @click="backToList">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="是否创建人群包？"
               :visible.sync="dialogShowContent"
               width="568px"
               class="my-dialog"
    >
      <p>生成人群需要一定的时间，请您耐心等待</p>
      <p>生成100万以下的人群在<span class="red-text">2个小时</span>之内完成；生成100万以上的人群至少需要<span class="red-text">8个小时</span>完成；</p>
      <p>1千以下的人群，无法生成人群画像。生成完成后，可以在"媒体直选"页面，利用人群包进行选点</p>
      <span slot="footer">
        <el-button @click="dialogShowContent = false" class="btn1">取 消</el-button>
        <el-button type="primary" class="btn1" @click="complete">确 定</el-button>
      </span>
    </el-dialog>
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
        dialogShowContent: false,
      }
    },
    methods: {
      ...mapMutations(["removeAllState"]),
      submitForm(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.dialogShowContent = true
          } else {
            return false;
          }
        });
      },
      complete(){
        //拼接数据
        //1 拼接tid  用于后台调用酷云
        //2 拼接tagnames  用于人群分析的展示
        //3 拼接city  分别在列表页以及人群分析展示(城市的名称)
        //关闭弹窗
        this.dialogShowContent = false;
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
        console.log(this.form)
        /*this.$api.peopleInsight.createPeopleCrowd(this.form)
          .then(res => {
            this.removeAllState();
            //跳转至列表页
            this.$router.push('/peopleInsight/list');
          })
          .catch(res => {
            this.$message({
              type: 'info',
              message: '保存失败'
            })
          })*/
      },
      backToList(){
        this.removeAllState();
        //跳转至列表页
        this.$router.push('/peopleInsight/list');
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
  .red-text {
    color: red;
  }
</style>

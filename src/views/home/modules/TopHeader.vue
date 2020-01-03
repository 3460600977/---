<template>
  <header id="top-header" class="top-header clearfix">


    <!-- logo -->
    <div class="logo mid" @click="menu.activeIndex=0; handleTo('/home')">
      <img class="logo-xinchao" :src="images.logo" alt="新潮传媒">
      <div class="logo-split"></div>
      <label class="company-name font-14 color-white">生活圈智投平台</label>
    </div>



    <!-- menu -->
    <ul class="my-menu font-14 relative">
      <li class="item"
          :class="{'active': index === menu.activeIndex}"
          @mouseenter="hoverMenu(menu.content, index)"
          @mouseleave="leaveMenu"
          @click="menu.activeIndex = index; handleTo(mitem.path)"
          v-for="(mitem, index) in menu.content" :key="index">
        <div class="menu-text" :class="{'active': index === menu.activeIndex}">
          {{mitem.name}}
        </div>
      </li>



      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...menu.moveBlockStyle}"></div>
    </ul>



    <!-- user msg -->
    <div class="user-msg color-white mid">
      <!-- 钱 -->
      <div
        @mouseenter="hoverRightMsg(0)"
        @mouseleave="leaveMenu"
        class="item icon-item mid"><img width="20px" :src="images.money" alt="">
      </div>

      <!-- 消息 -->
      <div
        @mouseenter="hoverRightMsg(1)"
        @mouseleave="leaveMenu"
        class="item icon-item mid">
        <el-badge :value="20">
          <img width="20px" :src="images.notification" alt="">
        </el-badge>
      </div>

      <!-- 用户信息，下拉菜单 -->
      <div
        @mouseenter="hoverRightMsg(2)"
        @mouseleave="leaveMenu"
        class="item">
        <div class="user-head mid clearfix">
          <img class="head" width="47px" :src="images.defaultAvatar" alt="头像">
          <div class="operation-box mid relative">
            <div class="user-name font-14">{{username}}</div>
            <i class="up-icon el-icon-caret-bottom" width="10px"/>
            <transition name="to-top">
              <div v-show="rightMsg.dropMenuShow" class="drop-box absolute font-14">
                <ul>
                  <li class="o-item center" @click="handleToAccount">账号管理</li>
                  <li class="o-item center" @click="handleToPass">修改密码</li>
                  <li class="o-item center color-red" @click="handleToLogout" :loading="loading">退出登录</li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...rightMsg.hoverBlock.style}"></div>
    </div>



    <!-- 修改密码 -->
    <el-dialog
      :visible.sync="dialogEditPass"
      :modal-append-to-body="false"
      width="780px"
      title="修改密码" class="edit-pass-dialog">
      <edit-pass-index @changeDialogEditPass="changeEditPass"></edit-pass-index>
    </el-dialog>


  </header>
</template>

<script>
  import { removeUserInfo, getUserInfo } from '@/utils/auth';
  import { MenuList } from '../../../utils/static'
  import editPassIndex from "../../../components/EditPass";
  import { MessageBox } from 'element-ui'

  export default {
    name: 'TopHeader',
    components: {
      editPassIndex
    },
    data() {
      return {
        MenuList,
        dialogEditPass: false,
        loading: false,
        images: {
          logo: require('../../../assets/images/icon_logo.png'),
          money: require('../../../assets/images/icons/icon_money.png'),
          notification: require('../../../assets/images/icons/icon_notification.png'),
          userHead: require('../../../assets/images/icons/icon_tx.png'),
          up: require('../../../assets/images/icons/icon_up.png'),
          defaultAvatar: require('../../../assets/images/icons/icon_head portrait.png'),
        },
        menu: {
          activeIndex: 0,
          moveBlockStyle: {
            width: '78px',
            transform: 'translateX(0px)',
            opacity: 0
          },
          content: [
            {name: '首页', path: '/home'},
            {name: '人群洞察', path: '/peopleInsight'},
            {name: '媒体智选', path: '/toolbox/resourceBundle'},
            {name: '投放管理', path: '/putManage'},
            {name: '报表中心', path: '/reportList'},
            {name: '财务管理', path: ''},
          ],
          audit: [
            {name: '审核管理', path: '/auditList'},
          ]
        },
        rightMsg: {
          hoverBlock: {
            width: ['70px', '70px', '210px'],
            style: {
              width: '70px',
              transform: 'translateX(0px)',
              opacity: 0
            }
          },
          dropMenuShow: false,
        },
        username: 'admin',
      }
    },

    methods: {
      changeDialog() {
        this.dialogEditPass = true
      },
      /**
       * 顶部菜单覆盖样式 宽度,位移
       * @param: menuArr 菜单数组
       * @param: index 覆盖的index
       */
      hoverMenu(menuArr, index) {
        let blockWidth = menuArr[index].name.length * 14 + 50;
        let left = 0;
        for (let i = 0; i < index; i++) {
          left += menuArr[i].name.length * 14 + 50;
        }
        this.menu.moveBlockStyle = {
          width: blockWidth + 'px',
          transform: `translateX(${left}px)`,
          opacity: 1
        }
      },
      /**
       * 右侧信息覆盖位移
       */
      hoverRightMsg(index) {
        if (index === 2) {
          this.rightMsg.dropMenuShow = true;
          this.rightMsg.hoverBlock.style = {
            width: this.rightMsg.hoverBlock.width[index],
            transform: `translateX(${index * 70}px)`,
            opacity: 1
          }
        }
        else {
          this.rightMsg.hoverBlock.style = {
            width: this.rightMsg.hoverBlock.width[index],
            transform: `translateX(${index * 70}px)`,
            opacity: 1
          }
        }
      },

      /**
       * 鼠标离开菜单
       */
      leaveMenu() {
        this.menu.moveBlockStyle.opacity = 0;
        this.rightMsg.hoverBlock.style.opacity = 0;
        this.rightMsg.dropMenuShow = false;
      },

      /**
       * 手动跳转
       */
      handleTo(path) {
        this.$router.push(path)
      },

      /**
       * 初始化时设置激活的菜单
       */
      setActiveTopMenu() {
        let currentBasePath = this.$route.path.split('/')[1];
        this.menu.content.forEach((item, index) => {
          if (item.path.indexOf(currentBasePath) !== -1) {
            this.menu.activeIndex = index;
          }
        })
      },

      handleToAccount() {
        this.$router.replace('/toolBox/account')
      },

      handleToPass() {
        this.dialogEditPass = true
      },

      handleToLogout() {
        MessageBox.confirm('登出后，身份信息失效，可以取消继续留在该页面，或者重新登录', '确定退出', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.Login.LoginOut().then(res => {
            this.loading = false;
            removeUserInfo()
            this.$store.commit('setToken', '')
            this.$router.replace('/login');
          }).catch(res => {
            this.loading = false;
          })
        })
      },

      changeEditPass(val) {
        this.dialogEditPass = val
      }
    },
    mounted() {
      //请求验证码接口
      let userInfo = getUserInfo()
      if (userInfo.avatar === null || userInfo.avatar === undefined || userInfo.avatar === "") { // "",null,undefined,NaN

      } else {
        this.images.defaultAvatar = userInfo.avatar
      }
      this.username = userInfo.userName
      if (this.username === 'XC12394') {
        this.menu.content = this.menu.audit
        this.$router.replace('/auditList')
      }
    },
    
    beforeMount() {
      this.setActiveTopMenu()
    },

    watch: {
      '$route.path': function() {
        this.setActiveTopMenu()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-badge__content{
    background-color: #fff !important;
    color: #C13130;
  }
  .top-header {
    width: 100%;
    z-index: 100;
    flex-shrink: 0;
    min-height: $headerHeight;
    background-color: #C13130;
    .logo {
      float: left;
      height: $headerHeight;
      margin-left: 30px;
      cursor: pointer;
      user-select: none;
      .logo-xinchao {
        width: 124px;
      }
      .logo-split {
        width: 1px;
        height: 20px;
        margin: 0 12px;
        background: #F1B8B7;
      }
      .company-name {
        margin-right: 50px;
      }
    }
    .my-menu {
      height: $headerHeight;
      float: left;
      color: #D4D4D4;
      .item {
        position: relative;
        z-index: 2;
        float: left;
        line-height: $headerHeight;
        padding: 0 25px;
        height: $headerHeight;
        letter-spacing: 0;
        cursor: pointer;
        transition: .3s;
        &.active {
          // background: #242945;
          color: #fff;
        }
        .menu-text {
          position: relative;
          height: $headerHeight - 4px;
          user-select: none;
          padding-bottom: $headerHeight - 4px;
          &.active {
            // border-bottom: 4px solid rgb(255, 255, 255);
            // border-bottom: 4px solid rgba(45, 90, 255, 1);
            &::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 10px;
              display: inline-block;
              width: 100%;
              height: 4px;
              border-radius: 2px;
              background: #fff;
            }
          }
        }
      }
      .hover-move-block {
        position: absolute;
        z-index: 1;
        top: 0;
        transition: 0.3s;
        height: $headerHeight;
        // background: #333A61;
        background: rgb(184, 41, 41);
      }
    }
    .user-msg {
      float: right;
      height: $headerHeight;
      margin-right: 28px;
      .item {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 0 25px;
        cursor: pointer;
        transition: .3s;
        &.icon-item {
          img{
            opacity: 0.7;
            transition: 0.3s;
          }
          &:hover{
            img{
              opacity: 1;
            }
          }
        }
        .user-head {
          height: 100%;
          .head {
            float: left;
          }
          .operation-box {
            float: left;
            height: $headerHeight;
            .user-name {
              margin: 0 10px;
              color: rgb(255, 255, 255);
            }
            .up-icon, .drop-box {
              color: rgb(255, 255, 255);
              transition: 0.3s;
            }
            &:hover {
              .up-icon {
                transform: rotate(180deg);
              }
            }
            .drop-box {
              // display: none;
              top: $headerHeight;
              right: 0;
              z-index: 10000;
              width: 100px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(233, 233, 233, 1);
              border-radius: 4px;
              .o-item {
                padding: 18px 0;
                color: #999999;
                border-bottom: 1px solid rgba(233, 233, 233, 1);
              }
            }
          }
        }
      }
      .hover-move-block {
        position: absolute;
        z-index: 1;
        top: 0;
        transition: 0.3s;
        height: $headerHeight;
        // background: #333A61;
        background: rgb(184, 41, 41);
      }
    }
  }
  @media screen and (max-width: 1280px) {
    .logo-split, .company-name {
      display: none;
    }
  }
</style>

<template>
  <header id="top-header" class="top-header clearfix mid">
    <!-- logo -->
    <div class="logo mid">
      <img class="logo-xinchao" :src="images.logo" alt="新潮传媒" />
      <div class="logo-split"></div>
      <label class="company-name font-14 color-white">生活圈智投平台</label>
    </div>

    <!-- menu -->
    <ul class="my-menu font-14 relative">
      <li
        class="item"
        :class="{'active': index === menu.activeIndex}"
        @mouseenter="hoverMenu(menu.content, index)"
        @mouseleave="leaveMenu"
        @click="handleTo(mitem.path, index)"
        v-for="(mitem, index) in menu.content"
        :key="index"
      >
        <div class="menu-text" :class="{'active': index === menu.activeIndex}">{{mitem.name}}</div>
      </li>

      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...menu.moveBlockStyle}"></div>
    </ul>

    <!-- user msg -->
    <div class="user-msg color-white mid">
      <!-- 钱 -->
      <!-- <div
        @mouseenter="hoverRightMsg(0)"
        @mouseleave="leaveMenu"
        class="item icon-item mid"><img width="20px" :src="images.money" alt="">
      </div>-->

      <!-- 消息 -->
      <!-- <div
        @mouseenter="hoverRightMsg(1)"
        @mouseleave="leaveMenu"
        class="item icon-item mid">
        <el-badge :value="20">
          <img width="20px" :src="images.notification" alt="">
        </el-badge>
      </div>-->

      <!-- 用户信息，下拉菜单 -->
      <!-- @mouseenter="hoverRightMsg(2)" -->
      <div @mouseenter="hoverRightMsg(0)" @mouseleave="leaveMenu" class="item">
        <div class="user-head mid clearfix">
          <img class="head" width="47px" :src="images.defaultAvatar" alt="头像" />
          <div class="operation-box mid relative">
            <div class="user-name font-14">{{username}}</div>
            <i class="up-icon el-icon-caret-bottom" width="10px" />
            <transition name="to-top">
              <div v-show="rightMsg.dropMenuShow" class="drop-box absolute font-14">
                <ul>
                  <li class="o-item center" @click="handleToAccount" v-if="auditShow">账号管理</li>
                  <li class="o-item center" @click="handleToPass" v-if="auditShow">修改密码</li>
                  <li
                    class="o-item center color-red"
                    @click="handleToLogout"
                    :loading="loading"
                  >退出登录</li>
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
      title="修改密码"
      class="edit-pass-dialog"
    >
      <edit-pass-index @changeDialogEditPass="changeEditPass"></edit-pass-index>
    </el-dialog>
  </header>
</template>

<script>
import {
  removeUserInfo,
  getUserInfo,
  removeMenuList,
  setMenuList,
  getMenuList
} from "@/utils/auth";
import { MenuList } from "../../../utils/static";
import editPassIndex from "../../../components/EditPass";
import { MessageBox } from "element-ui";

export default {
  name: "TopHeader",
  components: {
    editPassIndex
  },
  data() {
    return {
      MenuList,
      dialogEditPass: false,
      loading: false,
      auditShow: true,
      images: {
        logo: require("../../../assets/images/icon_logo.png"),
        money: require("../../../assets/images/icons/icon_money.png"),
        notification: require("../../../assets/images/icons/icon_notification.png"),
        userHead: require("../../../assets/images/icons/icon_tx.png"),
        up: require("../../../assets/images/icons/icon_up.png"),
        defaultAvatar: require("../../../assets/images/icons/icon_default_avatar@2x.png")
      },

      menu: {
        activeIndex: 0,
        moveBlockStyle: {
          width: "78px",
          transform: "translateX(0px)",
          opacity: 0
        },
        content: [],
        audit: [],
        notExist: [
          {
            code: "9999",
            name: "登录",
            selected: false,
            path: "/login",
            children: []
          },
          {
            code: "1500",
            name: "财务管理",
            selected: false,
            path: "/finance",
            children: []
          }
        ],
        money: false,
        notification: false
      },

      rightMsg: {
        hoverBlock: {
          width: ["210px", "70px", "210px"],
          style: {
            width: "70px",
            transform: "translateX(0px)",
            opacity: 0
          }
        },
        dropMenuShow: false
      },
      username: "admin"
    };
  },

  methods: {
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
        width: blockWidth + "px",
        transform: `translateX(${left}px)`,
        opacity: 1
      };
    },
    /**
     * 右侧信息覆盖位移
     */
    hoverRightMsg(index) {
      // if (index === 2) {
      this.rightMsg.dropMenuShow = true;
      // }
      this.rightMsg.hoverBlock.style = {
        width: this.rightMsg.hoverBlock.width[index],
        transform: `translateX(${index * 70}px)`,
        opacity: 1
      };
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
    handleTo(path, index) {
      if (this.$route.path === path) {
        return;
      }
      this.menu.activeIndex = index;
      this.$router.push(path);
    },

    /**
     * 初始化时设置激活的菜单
     */
    setActiveTopMenu() {
      let currentBasePath = this.$route.path.split("/")[1];
      this.menu.content.forEach((item, index) => {
        if (item.path.indexOf(currentBasePath) !== -1) {
          this.menu.activeIndex = index;
        }
      });
    },

    handleToAccount() {
      this.$router.replace("/home/account");
    },

    handleToPass() {
      this.dialogEditPass = true;
    },

    handleToLogout() {
      MessageBox.confirm(
        "登出后，身份信息失效，可以取消继续留在该页面，或者重新登录",
        "确定退出",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$api.Login.LoginOut()
          .then(res => {
            this.loading = false;
            removeUserInfo();
            removeMenuList();
            this.$store.commit("setToken", "");
            this.$router.replace("/login");
          })
          .catch(res => {
            this.loading = false;
            removeUserInfo();
            removeMenuList();
            this.$store.commit("setToken", "");
            this.$router.replace("/login");
          });
      });
    },

    changeEditPass(val) {
      this.dialogEditPass = val;
    }
  },
  mounted() {
    if (
      this.$router.currentRoute.path === "/auditList" ||
      this.$router.currentRoute.path === "/auditList/creative"
    ) {
      this.auditShow = false;
    }
    //获取用户头像，姓名
    let userInfo = getUserInfo();
    if (userInfo === null || userInfo === "") {
      return false;
    }
    //菜单处理
    for (let i = 0; i < this.MenuList.length; i++) {
      for (let j = 0; j < userInfo.menu.length; j++) {
        if (
          +this.MenuList[i].code === +userInfo.menu[j].code &&
          userInfo.menu[j].selected
        ) {
          userInfo.menu[j].path = this.MenuList[i].path;
          this.menu.content.push(userInfo.menu[j]);
          break;
        }
      }
    }
    for (let i = 0; i < this.menu.content.length; i++) {
      for (let j = 0; j < this.menu.notExist.length; j++) {
        if (+this.menu.content[i].code === +this.menu.notExist[j].code) {
          this.menu.content.splice(i, 1);
          break;
        }
      }
    }
    if (userInfo.avatar) {
      this.images.defaultAvatar = userInfo.avatar;
    }
    if (userInfo.userName) {
      this.username = userInfo.userName;
    }
    this.setActiveTopMenu();
  },

  watch: {
    "$route.path": function() {
      this.setActiveTopMenu();
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-badge__content {
  background-color: #fff !important;
  color: #c13130;
}
.top-header {
  width: 100%;
  z-index: 100;
  flex-shrink: 0;
  min-height: $headerHeight;
  background-color: #c13130;
  .logo {
    float: left;
    height: $headerHeight;
    margin-left: 70px;
    cursor: pointer;
    user-select: none;
    .logo-xinchao {
      width: 50px;
    }
    .logo-split {
      width: 1px;
      height: 20px;
      margin: 0 12px;
      background: #f1b8b7;
    }
    .company-name {
      width: 112px;
      height: 15px;
      font-size: 16px;
      font-weight: 400;
      word-break: keep-all;
    }
  }
  .my-menu {
    height: $headerHeight;
    width: 1200px;
    margin-left: 77px;
    margin-right: 120px;
    color: #fbb8b7;
    li.item {
      position: relative;
      z-index: 2;
      float: left;
      line-height: $headerHeight;
      padding: 0 25px;
      height: $headerHeight;
      letter-spacing: 0;
      cursor: pointer;
      transition: 0.3s;
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
      transition: 0.3s;
      &.icon-item {
        img {
          opacity: 0.7;
          transition: 0.3s;
        }
        &:hover {
          img {
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
          .up-icon,
          .drop-box {
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
  .logo-split,
  .company-name {
    display: none;
  }
}
</style>

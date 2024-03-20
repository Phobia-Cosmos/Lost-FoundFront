<template>
  <div class="manager-container">
    <!--  头部  -->
    <div class="manager-header">
      <!--      TODO:这里可不可以改成icon-->
      <div class="manager-header-left">
        <img src="@/assets/imgs/logo.png"/>
        <div class="title">失物招领系统</div>
      </div>

      <div class="manager-header-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: $route.path }">{{ $route.meta.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="manager-header-right">
        <el-dropdown placement="bottom">
          <div class="avatar">
            <img :src="user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"/>
            <!--            TODO：注意。用户的username或者name都可能为空-->
            <div>{{ user.role === 1 ? '管理员' : '用户' }}</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <a target="_blank" @click.prevent="updateInfo">
              <el-dropdown-item>修改个人信息</el-dropdown-item>
            </a>
            <a target="_blank" @click.prevent="updatePassword">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </a>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--  主体  -->
    <div class="manager-main">
      <!--  侧边栏  -->
      <div class="manager-main-left">
        <el-menu :default-openeds="['info', 'user']" router style="border: none" :default-active="$route.path">
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-menu-item index="/item">失物招领信息</el-menu-item>
          <el-menu-item index="/suggestion">用户建议</el-menu-item>
          <el-menu-item index="/employee">员工信息</el-menu-item>
        </el-menu>
      </div>

      <!--  数据表格  -->
      <div class="manager-main-right">
        <router-view @update:user="updateUser"/>
      </div>

      <el-dialog width="500px" title="修改个人信息" :visible.sync="showInfoDialog" @close="btnCancelInfo">
        <!-- 放置表单 -->
        <el-form ref="infoForm" label-width="120px" :model="infoForm" :rules="rules">
          <div style="margin: 15px; text-align: center">
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="infoForm.avatar" :src="infoForm.avatar" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="infoForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="infoForm.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="infoForm.phone" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="infoForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-input v-model="infoForm.school" placeholder="学校"></el-input>
          </el-form-item>
          <div style="text-align: center; margin-bottom: 20px">
            <el-button type="primary" @click="update">保 存</el-button>
            <el-button size="mini" @click="btnCancelInfo">取消</el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" @close="btnCancelPass">
        <!-- 放置表单 -->
        <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passForm.oldPassword" show-password size="small"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passForm.newPassword" show-password size="small"/>
          </el-form-item>
          <el-form-item label="重复密码" prop="confirmPassword">
            <el-input v-model="passForm.confirmPassword" show-password size="small"/>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="btnOK">确认修改</el-button>
            <el-button size="mini" @click="btnCancelPass">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {editAdminPassword, updateAdmin, uploadAdminPicture} from "@/apis/admin";

export default {
  name: "Manager",
  data() {
    return {
      showDialog: false, // 控制弹层的显示和隐藏
      showInfoDialog: false,
      uploadUrl: 'http://localhost:9090/admin/v2/user/upload', // Define the action URL
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      // TODO：注意更新好以后要同步到localstorage
      infoForm: {
        username: '', // 用户名
        name: '', // 姓名
        phone: '', // 电话
        email: '', // 邮箱
        school: '',
        avatar: ''
      },
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
        oldPassword: [
          {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }],
        newPassword: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            min: 6,
            max: 16,
            message: '新密码的长度为6-16位之间'
          }],
        confirmPassword: [
          {
            required: true,
            message: '重复密码不能为空',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // value
              if (this.passForm.newPassword === value) {
                callback()
              } else {
                callback(new Error('重复密码和新密码输入不一致'))
              }
            }
          }], // 确认密码字段
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '电话不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入有效的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    // TODO:把这个拦截放到permission中，而不是这里
    if (!this.user.id) {
      this.$router.push('/login')
    }
    this.infoForm.username = this.user.username || '';
    this.infoForm.name = this.user.name || '';
    this.infoForm.phone = this.user.phone || '';
    this.infoForm.email = this.user.email || '';
    console.log(this.user)
  },
  methods: {
    async handleAvatarSuccess(response) {
      // 把user的头像属性换成上传的图片的链接
      this.user.avatar = response.data;
      this.infoForm.avatar = response.data;
      console.log(this.infoForm.avatar)
    },
    updatePassword() {
      // 弹出层
      this.showDialog = true // 显示弹层
    },
    updateInfo() {
      // 弹出层
      this.showInfoDialog = true // 显示弹层
    },
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          const {oldPassword, newPassword} = this.passForm
          await editAdminPassword({oldPassword, newPassword, "userId": this.user.id})
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    update() {
      this.$refs.infoForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updateAdmin({...this.infoForm, id: this.user.id})
          this.$message.success('修改密码成功')
          this.btnCancelInfo()
        }
      })
    },
    // 取消
    btnCancelPass() {
      this.$refs.passForm.resetFields() // 重置表单
      this.showDialog = false
    },
    btnCancelInfo() {
      this.$refs.infoForm.resetFields()
      // 关闭弹层
      this.showInfoDialog = false
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('xm-user') || '{}')   // 重新获取下用户的最新信息
    },
    logout() {
      localStorage.removeItem('xm-user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import "@/assets/css/manager.css";

</style>


<!--//.avatar-uploader-icon {-->
<!--//  font-size: 28px;-->
<!--//  color: #8c939d;-->
<!--//  width: 120px;-->
<!--//  height: 120px;-->
<!--//  line-height: 120px;-->
<!--//  text-align: center;-->
<!--//  border-radius: 50%;-->
<!--//}-->


<!--.avatar {-->
<!--width: 120px;-->
<!--height: 120px;-->
<!--display: block;-->
<!--border-radius: 50%;-->
<!--}-->

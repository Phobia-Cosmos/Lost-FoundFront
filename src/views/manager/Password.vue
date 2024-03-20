<template>
  <div>
    <el-card style="width: 50%">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="padding-right: 50px">

        <el-form-item label="原始密码" prop="oldPassword">
          <el-input show-password v-model="form.oldPassword" placeholder="原始密码"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input show-password v-model="form.newPassword" placeholder="新密码"></el-input>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input show-password v-model="form.confirmPassword" placeholder="确认密码"></el-input>
        </el-form-item>

        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">确认修改</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {editAdminPassword} from "@/apis/admin";
import {loginUser} from "@/apis/user";

export default {
  name: "Password",
  data() {
    const validatePassword = (rule, value, callback) => {
      console.log(this.newPassword)
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.newPassword) {
        callback(new Error('确认密码错误'))
      } else {
        callback()
      }
    }
    return {
      id: JSON.parse(localStorage.getItem('xm-user') || '{}').id,
      form: {
        oldPassword: 'lzh',  // Initialize with empty string
        newPassword: 'lzh',  // Initialize with empty string
        confirmPassword: 'lzh',  // Initialize with empty string
      },
      rules: {
        oldPassword: [
          {required: true, message: '请输入原始密码', trigger: 'blur'},
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
        ],
        // confirmPassword: [
        //   {validator: validatePassword, required: true, trigger: 'blur'},
        // ],
      }
    }
  },
  methods: {
    update() {
      this.$refs['formRef'].validate(async (valid) => {
        if (valid) {
          try {
            // Call the registerUser function instead of directly using $request.post
            // 这里应该是一个异步调用，还有就是下面的状态码是数字而不是字符串
            const {oldPassword, newPassword} = this.form; // Destructure form object
            const id = this.id;
            const data = {oldPassword, newPassword, userId:5}; // Create data object to send to API

            const res = await editAdminPassword(data); // Wait for API call to complete
            if (res.code === '200') {
              // 成功更新
              localStorage.removeItem('xm-user'); // 清除缓存的用户信息
              this.$message.success('修改密码成功');
              this.$router.push('/login');
            } else {
              this.$message.error(res.msg);
            }
          } catch (error) {
            console.error(error);
            this.$message.error('An error occurred during registration.');
          }
        }
      })
    },
  }
}
</script>

<style scoped>
/deep/ .el-form-item__label {
  font-weight: bold;
}
</style>

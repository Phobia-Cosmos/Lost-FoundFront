<template>
  <el-dialog title="审核意见" :visible="showDialog" @close="close">

    <el-form ref="suggestionForm" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="审核意见" prop="content">
        <el-input v-model="formData.content" placeholder="请输入审核意见"></el-input>
      </el-form-item>
    </el-form>

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {validateItem} from "@/apis/item";
import {validateSuggestion} from "@/apis/suggestion";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    },
    status: {
      type: Number,
      default: null
    }
  },
  created() {
    // 刚创建时并未赋值
  },
  data() {
    return {
      formData: {
        content: ''
      },
      rules: {
        content: [{required: true, message: '请输入审核意见', trigger: 'blur'}]// Validation rule for content
      }
    };
  },
  methods: {
    close() {
      // 修改父组件的值 子传父
      // resetFields 只能重置在模板中绑定的数据
      // TODO：这里要修改后端
      this.suggestion = ''
      this.$refs.suggestionForm.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    btnOK() {
      this.$refs.suggestionForm.validate(async isOK => {
        if (isOK) {
          // console.log(this.formData.content)
          const response = await validateSuggestion({id: this.currentNodeId, status: this.status, msg:this.formData.content});
          // 通知父组件更新
          this.$emit('updateStatus')
          // 提示消息
          this.$message.success(response.msg)
          this.close()
        }
      })
    },
  }
};
</script>

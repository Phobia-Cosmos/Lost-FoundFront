<template>
  <div class="dashboard-container">
    <div class="container">
      <!--      <el-input placeholder="请输入账号查询" style="width: 200px" v-model="username"></el-input>-->
      <!--      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>-->
      <!--      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>-->

      <!--      <el-button type="primary" plain @click="handleAdd">新增</el-button>-->
      <!--      <el-button type="danger" plain @click="delBatch">批量删除</el-button>-->
      <div class="tableBar">
        <label style="margin-right: 10px">用户名称：</label>
        <el-input v-model="queryParams.username"
                  placeholder="请填写用户名称"
                  style="width: 14%"
                  clearable
                  @clear="getEmployeeList"
                  @keyup.enter.native="initFun"/>

        <label style="margin-right: 10px; margin-left: 20px">用户学校：</label>
        <el-input v-model="queryParams.school"
                  placeholder="请填写用户学校"
                  style="width: 14%"
                  clearable
                  @clear="getEmployeeList"
                  @keyup.enter.native="initFun"/>

        <el-button class="normal-btn continue"
                   @click="getEmployeeList()">
          查询
        </el-button>
      </div>


      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <!--        <el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="id" label="序号" width="70" align="center" sortable/>
        <el-table-column prop="username" label="用户名"/>
        <!--        <el-table-column prop="name" label="姓名"/>-->
        <el-table-column label="头像" show-overflow-tooltip>
          <template v-slot="scope">
            <!--            <div style="display: flex; align-items: center">-->
            <el-image style="width: 40px; height: 40px; border-radius: 50%" v-if="scope.row.avatar"
                      :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
            <!--            </div>-->
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话"/>
        <el-table-column prop="email" label="邮箱"/>

        <el-table-column prop="role" label="角色" :formatter="formatRole"/>
        <el-table-column prop="school" label="学校"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row style="height: 60px" align="middle" type="flex" justify="end">
        <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 20]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </el-row>
    </div>


    <el-dialog title="管理员" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              class="avatar-uploader"
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {pageQueryAdmin} from "@/apis/admin";

export default {
  name: "Employee",
  data() {
    return {
      tableData: [],  // 所有的数据
      queryParams: {
        page: 1,
        pageSize: 5,
        username: null,
        phone: null,
        email: null,
        school: null
      },
      total: 0,

      username: null,
      fromVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ]
      },
      ids: []
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      try {
        const response = await pageQueryAdmin(this.queryParams);
        const {data} = response;
        const {records, total} = data;
        this.total = total;
        this.tableData = records.map(record => ({
          ...record,
          createTime: this.formatDate(record.createTime),
        }));
        console.log(this.tableData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    initFun() {
      this.page = 1
      this.getEmployeeList()
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatRole(role) {
      switch (role.role) {
        case 0:
          return '管理员';
        case 1:
          return '用户';
        default:
          return '未知种类';
      }
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true   // 打开弹窗
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/admin/update' : '/admin/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('保存成功')
              this.load(1)
              this.fromVisible = false
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/admin/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)
    },
    delBatch() {   // 批量删除
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确定批量删除这些数据吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/admin/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    // load(pageNum) {  // 分页查询
    //   if (pageNum) this.pageNum = pageNum
    //   this.$request.get('/admin/v2/user/page', {
    //     params: {
    //       page: this.pageNum,
    //       pageSize: this.pageSize,
    //     }
    //   }).then(res => {
    //     this.tableData = res.data?.records
    //     this.total = res.data?.total
    //   })
    // },
    reset() {
      this.queryParams.name = null
      this.getEmployeeList()
    },
    handleCurrentChange(pageNum) {
      this.queryParams.page = pageNum;
      this.getEmployeeList();
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getEmployeeList();
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把头像属性换成上传的图片的链接
      this.form.avatar = response.data
    },
  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 30px;
}

.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}

.dashboard-container .container .normal-btn {
  background: #333333;
  color: white;
  margin-left: 20px;
}

.dashboard-container .container .tableBar {
  margin-bottom: 20px;
}

.dashboard-container .container .tableBar .tableLab {
  display: inline-block;
  float: right;
}

.dashboard-container .container .tableBar .tableLab span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: $gray-2; /* Assuming $gray-2 is a SASS/SCSS variable, replace with actual color value */
}

.dashboard-container .container .tableBox {
  width: 100%;
  border: 1px solid $gray-5; /* Assuming $gray-5 is a SASS/SCSS variable, replace with actual color value */
  border-bottom: 0;
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}

</style>

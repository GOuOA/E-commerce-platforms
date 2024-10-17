<!-- 商品分类组件 -->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-col><el-button type="primary" @click="showAddCateDialog">添加分类</el-button></el-col>
            </el-row>
            <!-- 商品分类列表数据展示 -->
            <!-- 分类表格
            :data(设置数据源) 
            :columns(设置表格中列配置信息) 
            :selection-type(是否有复选框)
            :expand-type(是否展开数据) 
            show-index(是否设置索引列)
            index-text(设置索引列头)
            border(是否添加纵向边框) 
            :show-row-hover(是否鼠标悬停高亮) -->
            <tree-table class="tableTree" :data="cateList" :columns="columns" :selection-type="false"
                :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"
                        @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
            <el-form :model="addCateForm" label-width="100px" :rules="addCateFoemRules" ref="addCateFormRef">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->

                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="parentCateList"
                        :props="cascaderProps" @change="parentCateChanged" clearable :change-on-select="true"
                        popper-class="removeRadio">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editRoleForm" label-width="100px" :rules="editRoleFormRules" ref="editRoleFormRef">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editRoleForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.tableTree {
    margin-top: 15px;
}

.removeRadio .el-radio__inner {
    border-radius: 0;
    border: 0;
    width: 170px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
    top: -18px;
    left: -19px;
}

.removeRadio .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
}

/* 设置级联选择器的宽度  */
.el-cascader {
    width: 100%;
}
</style>

<script>
export default {
    data() {
        return {
            //查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //商品分类列表数据，默认为空
            cateList: [],
            total: 0,// 总数据条数
            //为table指定列的定义
            //先在columns中添加一个列
            columns: [
                { label: '分类名称', prop: 'cat_name' },
                //type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
                { label: '是否有效', prop: '', type: 'template', template: 'isok' },
                { label: '排序', prop: '', type: 'template', template: 'order' },
                { label: '操作', prop: '', type: 'template', template: 'opt' }
            ],
            // 添加分类对话框
            addCateDialogVisible: false,
            // 添加分类表单
            addCateForm: {
                // 分类名称
                cat_name: '',
                // 父级分类Id
                cat_pid: 0,
                // 分类等级，默认要添加的是1
                cat_level: 0,
            },
            // 添加分类表单校验规则
            addCateFoemRules: {
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            // 父级分类列表
            parentCateList: [],
            // 级联选择框的配置对象
            cascaderProps: {
                // 选项的value值
                value: 'cat_id',
                // 选项的label值
                label: 'cat_name',
                // 选项的子级
                children: 'children'
            },
            // 选中的父级分类的Id数组
            selectedKeys: [],
            // 编辑分类对话框
            editDialogVisible: false,
            // 编辑分类表单校验规则
            editRoleFormRules: {
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            // 编辑分类表单
            editRoleForm: {
                // 分类名称
                cat_name: '',
                // 父级分类Id
                cat_pid: 0,
                // 分类等级，默认要添加的是1
                cat_level: 0,
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //获取商品分类数据列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类数据失败！')
            }
            console.log(res)
            //把商品分类数据列表赋值给cateList
            this.cateList = res.data.result
            //把总数据条数赋值给total
            this.total = res.data.total
        },
        // 监听pagesize改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 打开添加分类对话框
        showAddCateDialog() {
            // 先获取父级分类数据列表
            this.getParentCateList()
            // 打开添加分类对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories',
                { params: { type: 2 } })
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败！')
            }
            console.log(res.data)
            // 把父级分类数据列表赋值给parentCateList
            this.parentCateList = res.data
        },
        // 选择项发生变化触发这个函数
        parentCateChanged() {
            console.log(this.selectedKeys)
            // 如果 selectedKeys 长度的大于0，证明有选中的父级分类
            // 反之，没有选中的父级分类
            if (this.selectedKeys.length > 0) {
                // 把选中的父级分类的Id赋值给addCateForm.cat_pid
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 把选中的父级分类的等级赋值给addCateForm.cat_level
                this.addCateForm.cat_level = this.selectedKeys.length
            } else {
                // 没有选中的父级分类，把cat_pid和cat_level重置为0
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 监听对话框的关闭事件，重置表单
        addCateDialogClose() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 点击按钮，添加新的分类
        async addCate() {
            // 表单校验
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                // 发送请求，添加新的分类
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                // 重新获取商品分类列表数据
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 点击按钮，删除商品分类
        async deleteCate(id) {
            // 提示用户是否确认删除
            const confirmResult = await this.$confirm('请问是否要永久删除该分类', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => { //用catch捕获错误信息
                return err
            })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // 发送请求，删除商品分类
            const { data: res } = await this.$http.delete(`categories/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除分类失败！')
            }
            this.$message.success('删除分类成功！')
            // 重新获取商品分类列表数据
            this.getCateList()
        },
        editDialogClose() {
            this.$refs.editRoleFormRef.resetFields()
            this.editDialogVisible = false
        },
        // 打开编辑角色的对话框
        async showEditDialog(id) {
            //发送请求根据id获取角色信息
            const { data: res } = await this.$http.get(`categories/${id}`)
            //如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('获取角色信息失败')
            //如果返回状态为正常状态，获取角色信息成功
            this.editRoleForm = res.data
            //显示弹出框
            this.editDialogVisible = true
        },
        // 编辑分类名称确认按钮事件
        async editRole() {
            // 表单校验
            this.$refs.editRoleFormRef.validate(async valid => {
                if (!valid) return
                // 发送请求，编辑分类名称
                const { data: res } = await this.$http.put(`categories/${this.editRoleForm.cat_id}`, this.editRoleForm)
                if (res.meta.status !== 200) {
                    return this.$message.error('编辑分类名称失败！')
                }
                this.$message.success('编辑分类名称成功！')
                // 重新获取商品分类列表数据
                this.getCateList()
                this.editDialogVisible = false
            })
        }
    }
}

</script>
<!-- 商品列表组件 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="170px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="goEdigpage(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 编辑商品弹窗 -->
        <el-dialog title="编辑商品" :visible.sync="dialogVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style></style>

<script>
export default {
    data() {
        return {
            // 查询参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            // 商品列表数据
            goodslist: [],
            // 总数据条数
            total: 0,
            // 编辑商品弹窗是否显示
            dialogVisible: false,
            // 编辑商品表单数据
            form: {
                goods_name: '',
                goods_price: '',
                goods_weight: ''
            }
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表失败！')
            }
            this.$message.success('获取商品列表成功！')
            console.log(res.data)
            this.goodslist = res.data.goods
            this.total = res.data.total
        },
        // 监听分页大小改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 监听分页页码改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 删除商品
        async removeById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该作品，是否继续', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete(`goods/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getGoodsList()
        },
        // 跳转至添加页面
        goAddpage() {
            this.$router.push('/add')
        },
        // 显示编辑商品弹窗
        goEdigpage(id) {
            this.$router.push(`/edit`)
            sessionStorage.setItem('editId', id)
        },
        // 点击确定修改
        async editRole() {
            const { data: res } = await this.$http.put(`goods/${this.form.goods_id}`, this.form)
            if (res.meta.status !== 200) {
                return this.$message.error('修改商品信息失败！')
            }
            this.$message.success('修改商品信息成功！')
            this.dialogVisible = false
            this.getGoodsList()
        }
    }
}
</script>
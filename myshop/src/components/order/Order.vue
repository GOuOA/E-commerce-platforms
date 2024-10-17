<!-- 订单列表数据展示 -->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表数据 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <!-- 是否付款 -->
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === '1'" type="success">已支付</el-tag>
                        <el-tag v-else type="danger">未支付</el-tag>
                    </template>
                </el-table-column>
                <!-- 是否发货 -->
                <el-table-column prop="is_send" label="是否发货">
                    <template slot-scope="scope">
                        <template>
                            {{ scope.row.is_send }}
                        </template>
                    </template>
                </el-table-column>
                <!-- 下单时间 -->
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改地址对话框 @close="addressDialogClosed" -->
        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度的对话框 -->
        <!-- <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
            时间线
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{ activity.content }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog> -->
        <!-- el-dialog 物流进度的对话框 -->
        <!-- <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
            <span>这是一段信息</span>
        </el-dialog> -->


    </div>
</template>

<script>
// 引入城市数据
import cityData from './citydata.js'
export default {

    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            total: 0,
            orderlist: [],
            addressVisible: false,
            addressForm: {
                address1: [],
                address2: '',
            },
            addressFormRules: {
                address1: [{ required: true, message: '请选择省市区/县', trigger: 'change' }],
                address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
            },
            cityData,
            // progressVisible: false,
            // progressInfo: []
        }
    },
    created() {
        this.getOrderList();
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo,
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单列表失败')
            }
            // this.$message.success('获取订单列表成功')
            console.log(res.data)
            this.orderlist = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 显示地址弹框
        showBox() {
            this.addressVisible = true
        },
        // async showProgressBox() {
        //     const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
        //     if (res.meta.status !== 200) {
        //         return this.$message.error('获取物流进度失败')
        //     }
        //     this.progressInfo = res.data
        //     this.progressVisible = true
        //     console.log(res.progressInfo)
        // },
    },
    computed: {
        filteredOrderlist() {
            // 如果没有查询字符串，则返回完整的订单列表
            if (!this.queryInfo.query) {
                return this.orderlist
            }
            // 使用查询字符串过滤订单列表
            const query = this.queryInfo.query.toLowerCase()
            return this.orderlist.filter(order => {
                return (
                    order.order_number.toLowerCase().includes(query)
                )
            })
        },
    },
}
</script>

<style></style>

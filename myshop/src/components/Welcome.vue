<!-- 首页欢迎组件 -->
<template>
    <div style="height: 90%">
        <h6 class="wel">欢迎使用</h6>
        <div class="container">
            <el-calendar v-model="value"> </el-calendar>
            <el-card>
                <el-row>
                    <el-col :span="8">
                        <h1 style="font-size: 19px">待办事项</h1>
                    </el-col>
                </el-row>
                <hr />
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon"
                        :type="activity.type" :color="activity.color" :size="activity.size"
                        :timestamp="activity.timestamp">
                        {{ activity.content }}
                    </el-timeline-item>
                </el-timeline>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelCome',
    data() {
        return {
            value: new Date(),
            activities: [
                {
                    content: '愿世界美好与你同在',
                    timestamp: '2022-04-12 20:46',
                    color: 'red'
                },
                {
                    content: '人们相互蔑视，又相互奉承，人们各自希望自己高于别人，又各自匍匐在别人面前',
                    timestamp: '2022-04-03 18:30',
                    color: '#0bbd87'
                },
                {
                    content: '大家都愿意盲从，好像世界上最安全的事就是让自己消失在“多数”之中',
                    timestamp: '2022-02-28 17:55',
                    color: 'skyblue'
                },
                {
                    content: '一个人总是可以善待他毫不在意的人',
                    timestamp: '2018-02-15 21:13',
                    color: 'pink'
                },
                {
                    content: '很多人觉得他们在思考，而实际上他们只是在重新整理自己的偏见',
                    timestamp: '2018-01-25 20:00',
                    color: 'purple'
                }
            ]
        }
    }
}
</script>

<style lang="less" scoped>
.wel {
    margin:0 auto;
    font-size: 33px;
    text-align: center;
    font-weight: normal;
    color: black;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.container {
    margin: 0 auto;
    display: flex;
    height: 640px;
    justify-content: space-around;

    .el-card {
        width: 520px;
    }

    .el-calendar {
        width: 520px;
    }

    hr {
        margin-bottom: 25px;
    }

    .el-timeline {
        margin-right: 20px;
    }
}
</style>
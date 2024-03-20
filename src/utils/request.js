import axios from 'axios'
import router from "@/router";

// 创建可一个新的axios对象
const request = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,   // 后端的接口地址  ip:port
    timeout: 10000                          // 10s请求超时
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    console.log("intercept request!"+ config.url)

    config.headers['Content-Type'] = 'application/json;charset=utf-8';        // 设置请求头格式
    let user = JSON.parse(localStorage.getItem("xm-user") || '{}')  // 获取缓存的用户信息
    // console.log(user)
    // console.log(user.token)

    // Set different tokens based on different request URLs
    if (config.url.includes('admin')) {
        config.headers['token'] = user.token;
        // console.log("admin")
    } else {
        config.headers['authentication'] = user.token;
    }

    return config
}, error => {
    console.error('request error: ' + error) // for debug
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // console.log(response)

        let res = response.data;
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if (res.code === '401') {
            router.push('/login')
        }
        return res;
    },
    error => {
        console.error('response error: ' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

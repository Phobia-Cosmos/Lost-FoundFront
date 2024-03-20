import request from '@/utils/request'

// registerUser 函数似乎在使用 params 属性向请求传递数据。在 Axios 中，params 属性用于传递查询参数，这些参数会追加到 URL 中。
export function registerUser(data) {
    return request({
        url: '/user/v2/user/register',
        method: 'post',
        data
    })
}

export function loginUser(data) {
    return request({
        url: '/user/v2/user/login',
        method: 'post',
        data
    })
}

export function uploadUserPicture(data) {
    return request({
        url: '/user/v2/user/upload',
        method: 'post',
        data
    })
}

export function deleteUser(data) {
    return request({
        url: '/user/v2/user',
        method: 'delete',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/user/v2/user',
        method: 'put',
        data
    })
}

export function editUserPassword(data) {
    return request({
        url: '/user/v2/user/editPassword',
        method: 'put',
        data
    })
}

export function getUserById(id) {
    return request({
        url: `/user/v2/user/${id}`,
    })
}

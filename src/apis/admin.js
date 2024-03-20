import request from '@/utils/request'

export function registerAdmin(data) {
    return request({
        url: '/admin/v2/user/register',
        method: 'post',
        data
    })
}

export function loginAdmin(data) {
    return request({
        url: '/admin/v2/user/login',
        method: 'post',
        data
    })
}

export function uploadAdminPicture(data) {
    return request({
        url: '/admin/v2/user/upload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}

export function deleteAdmin(data) {
    return request({
        url: '/admin/v2/user',
        method: 'delete',
        data
    })
}

export function updateAdmin(data) {
    return request({
        url: '/admin/v2/user',
        method: 'put',
        data
    })
}

export function editAdminPassword(data) {
    return request({
        url: '/admin/v2/user/editPassword',
        method: 'put',
        data
    })
}

export function getAdminById(id) {
    return request({
        url: `/admin/v2/user/${id}`,
    })
}

export function pageQueryAdmin(params) {
    return request({
        url: `/admin/v2/user/page`,
        params
    })
}

import request from '@/utils/request'

export function publishItem(data) {
    return request({
        url: '/user/v2/item',
        method: 'post',
        data
    })
}

export function uploadItemPicture(data) {
    return request({
        url: '/user/v2/item/upload',
        method: 'post',
        data
    })
}

export function modifyItem(data) {
    return request({
        url: '/user/v2/item',
        method: 'put',
        data
    })
}

export function finishItem(data) {
    return request({
        url: '/user/v2/item/finish',
        method: 'put',
        data
    })
}

export function deleteItem(data) {
    return request({
        url: '/user/v2/item',
        method: 'delete',
        data
    })
}

export function userGetItemById(id) {
    return request({
        url: `/user/v2/item/${id}`,
    })
}

export function userPageQuery(params) {
    return request({
        url: `/user/v2/user/page`,
        params
    })
}

export function adminPageQuery(params) {
    return request({
        url: `/admin/v2/item/page`,
        params
    })
}

export function validateItem(data) {
    return request({
        url: '/admin/v2/item/validate',
        method: 'put',
        data
    })
}

export function adminGetItemById(id) {
    return request({
        url: `/admin/v2/item/${id}`,
    })
}

export function adminGetAllItem() {
    return request({
        url: `/admin/v2/item/allItem`,
    })
}

export function adminGetLostItem() {
    return request({
        url: `/admin/v2/item/lostItem`,
    })
}

export function adminGetFoundItem() {
    return request({
        url: `/admin/v2/item/findItem`,
    })
}

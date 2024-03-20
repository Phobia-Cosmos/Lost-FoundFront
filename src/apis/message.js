import request from '@/utils/request'

export function publishMessage(data) {
    return request({
        url: '/user/v2/message',
        method: 'post',
        data
    })
}

export function deleteMessage(data) {
    return request({
        url: '/user/v2/message',
        method: 'delete',
        data
    })
}

export function loadOld(params) {
    return request({
        url: `/user/v2/message/old`,
        params
    })
}

export function loadNew(params) {
    return request({
        url: `/user/v2/message/new`,
        params
    })
}

import request from '@/utils/request'

export function publishSuggestion(data) {
    return request({
        url: '/user/v2/suggest',
        method: 'post',
        data
    })
}

export function modifySuggestion(data) {
    return request({
        url: '/user/v2/suggest',
        method: 'put',
        data
    })
}

export function voteUp(data) {
    return request({
        url: '/user/v2/suggest/voteUp',
        method: 'put',
        data
    })
}

export function voteDown(data) {
    return request({
        url: '/user/v2/suggest/voteDown',
        method: 'put',
        data
    })
}

export function deleteSuggestion(data) {
    return request({
        url: '/user/v2/suggest',
        method: 'delete',
        data
    })
}

export function userGetSuggestionById(id) {
    return request({
        url: `/user/v2/suggest/${id}`,
    })
}

export function userPageQuerySuggestion(params) {
    return request({
        url: `/user/v2/suggest/page`,
        params
    })
}

export function adminPageQuerySuggestion(params) {
    return request({
        url: `/admin/v2/suggest/page`,
        params
    })
}

export function validateSuggestion(data) {
    return request({
        url: '/admin/v2/suggest/validate',
        method: 'put',
        data
    })
}

export function adminGetSuggestionById(id) {
    return request({
        url: `/admin/v2/suggest/${id}`,
    })
}

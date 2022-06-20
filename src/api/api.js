/**
 * @file
 * @description api接口封装
 */
import request from '@/api/request';

/**
 * @function 登录接口
 */
export const login = (data) => {
    return request({url: 'login', method: 'POST', data});
};
/**
 *
 * @function {getMenus} 获取菜单信息
 */
export const getMenus = () => request({url: 'menus', method: 'get'});
/**
 *
 * @param model 用户user列表数据
 * @return {*}
 */
export const getUserData = (model) => {
    return request('users', {
        params: model,
    });
};
/**
 *
 * @param id
 * @param bool
 * @return {*}  user修改状态
 */
export const switchUser = (id, bool) => {
    return request({url: `users/${id}/state/${bool}`, method: 'put'});
};
/**
 * 添加用户
 */
export const addUser = (model) => {
    console.log(model);
    return request.post('users', model);
};
/**
 *
 * @param model 修改用户数据
 * @return {Promise<AxiosResponse<any>>}
 */
export const editUser = (model) => {
    return request.put(`users/${model.id}`, model);
};
/**
 *
 * @param id 删除用户
 * @return {AxiosPromise}
 */
export const deleteUser = (id) => request.delete(`users/${id}`);
/**
 * 获取用户权限
 * @return {Promise<AxiosResponse<any>>}
 */
export const getUserRoles = () => request.get(`roles`);

export const editUserRoles = (id, rid) => {
    return request.put(`users/${id}/role`, rid);
};
/**
 *
 * @param roleId 删除tag标签的方法
 * @param rightId
 * @return {Promise<AxiosResponse<any>>}
 */
export const delTags = (roleId, rightId) => {
    return request.delete(`roles/${roleId}/rights/${rightId}`);
};
/**
 * 添加角色
 * @param model
 * @return {Promise<AxiosResponse<any>>}
 */
export const Api_addrole = (model) => request.post('roles', model);

export const editRol = (model) => request.put(`roles/${model.id}`, model);

export const delRole = (id) => request.delete(`roles/${id}`);

export const getRoleTree = () => request.get('rights/tree');

export const setRoleTree = (id, rids) =>
    request.post(`roles/${id}/rights`, {rids});
export const getRightList = () => request.get('rights/list');
export const getGoodsList = (model) =>
    request.get('goods', {
        params: model,
    });
export const addGoods = (model) => {
    return request.post('goods', model);
};
export const delGoods = (id) => request.delete(`goods/${id}`);
export const editGoods = (model) =>
    request.put(`goods/${model.goods_id}`, model);
export const api_getCatList = () => request.get('categories');
export const api_getCatParms = (catId, atname) => {
    return request.get(`categories/${catId}/attributes`, {
        params: {
            sel: atname,
        },
    });
};
export const api_addParams = (catId, name, sel) => {
    return request.post(`categories/${catId}/attributes`, {
        attr_name: name,
        attr_sel: sel,
    });
};
export const api_editParams = (catId, attrId, attrSel) => {
    return request.get(`categories/${catId}/attributes/${attrId}`, {
        params: {
            attr_sel: attrSel,
        },
    });
};
export const editAttr = (catId, attrId, attrName, attrSel) => {
    return request.put(`categories/${catId}/attributes/${attrId}`, {
        attr_name: attrName,
        attr_sel: attrSel,
    });
};
export const delAttr = (catId, attrId) => {
    return request.delete(`categories/${catId}/attributes/${attrId}`);
};
export const api_saveAttr = (catId, attrId, attrName, attrSel, attrVals) => {
    return request.put(`categories/${catId}/attributes/${attrId}`, {
        attr_name: attrName,
        attr_sel: attrSel,
        attr_vals: attrVals.join(' '),
    });
};
export const api_getCardList = (info) => {
    return request.get('categories', {
        params: info,
    });
};
export const api_getPrCardList = () => {
    return request.get('categories', {
        type: 2,
    });
};
export const api_addCate = (addForm) => {
    return request.post('categories', addForm);
};
export const api_editcateList = (cat_id) => {
    return request.get(`categories/${cat_id}`);
};
export const api_editCartSummit = (cat_id, catname) => {
    return request.put(`categories/${cat_id}`, {
        cat_name: catname,
    });
};
export const del_categories = (id) => {
    return request.delete(`categories/${id}`);
};
export const api_getOrderList = (model) => {
    return request.get('orders', {
        params: model
    })
}
export const api_kuaidi = (id) => {
    return request.get('/kuaidi/' + id)
}
export const api_getReports = () => {
    return request.get('reports/type/1')
}



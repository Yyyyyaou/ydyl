/**
 * 为actions 稿件相关提供函数
 */
import httpAxiosO from 'ROOT_URL/api/http/httpAxios';

/**
 * 逻辑删除稿件（即放入回收站）
 */
export async function deleteLogicDeleteFn(ctx,idsP){
  return await httpAxiosO({
    method: 'delete',
    url: '/web/article/delete.do',
    params: {
      ids: idsP.ids
    },
  })
}


/**
 * 物理删除稿件（真实删除，即不放入回收站，真正删除）
 */
export async function deletePhysicsDeleteFn(ctx,idsP){
  return await httpAxiosO({
    method: 'delete',
    url: '/web/article/del.do',
    params: {
      ids: idsP
    },
  })
}

/**
 * 清空回收站
 */
export async function deleteDelAllFn(){
  return await httpAxiosO({
    method: 'delete',
    url: '/web/article/delAll',
  })
}

/**
 * 草稿箱-编辑/回收站-继续采用
 * 于 20240417.1535 弃用
 */
export async function getUpdateFn(ctx,paramsP){
  console.log('paramsP',ctx,paramsP.params);

  return await httpAxiosO({
    method: 'get',
    url: '/web/article/update.do',
    params: paramsP.params
  })
}


/**
 * 我的投稿-查看
 */
export async function getArticleFindByIdFn(ctx,idP){
  ctx
  return await httpAxiosO({
    method: 'get',
    url: '/web/article/findById.do',
    params: {
      id: idP
    }
  })
}

/**
 * 通知公告-查看
 */
export async function getNoticeFindByIdFn(ctx,idP){
  ctx
  return await httpAxiosO({
    method: 'get',
    url: '/web/notice/findById.do',
    params: {
      id: idP
    }
  })
}



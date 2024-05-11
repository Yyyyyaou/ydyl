//外审稿件、投稿相关
import httpAxiosO from "ROOT_URL/api/http/httpAxios";

/**
 * 外审稿件详情页面 接口
 */
export function externalAuditArticleFindByIdFn(ctx,idP){
  ctx
  return httpAxiosO({
    mothed:'get',
    url:'/web/externalAuditArticle/findById.do',
    params:{
      id:idP
    }
  })
}



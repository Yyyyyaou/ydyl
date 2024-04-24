/**
 * 角色相关信息
 */

//角色集合
export const ROLESETO = {

  //外部用户
  '外部用户':{},

  //外部用户_国家发改委
  '外部用户_国家发改委':{
      //审核流程记录 标题 与 接口返回编码 对应关系
      'auditSign':{
        '2_1':'审核未通过',
        '2_2':'审核通过',
        '2_3':'修改后直接签发',
        '2_4':'修改后送审国家改革发展委员会',
      },
      //外审提交 接口地址
      'auditInterfaceUrl':'api/web/externalAuditArticle/DevelopmentReformCommission/audit.do',

  },

  //外部用户_国家信息中心
  '外部用户_国家信息中心':{
    //审核流程记录 标题 与 接口返回编码 对应关系
    'auditSign':{
        '1_1':'审核未通过',
        '1_2':'审核通过',
        '1_3':'修改后直接签发',
        '1_4':'修改后送审国家改革发展委员会',
        '1_5':'修改后送审国家信息中心',
        '1_6':'送审国家改革发展委员会',
    },
    //外审提交 接口地址
    'auditInterfaceUrl':'api/web/externalAuditArticle/NationalInformationCenter/audit.do',
  },

}
//end of ROLESETO

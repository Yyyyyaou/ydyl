<template>
  <div class="mid-content">
    <div class="noticedetail-content">
      <div class="noticedetail-content-title flexcenter">
        {{ title }}
      </div>
      <div class="noticedetail-content-info flexcenter">
        <span>作者：李某某</span>
        <span class="sx"></span>
        <span>稿件来源：生态环境部</span>
        <span class="sx"></span>
        <span>发布时间：{{ time }}</span>
      </div>
      <div class="mid-divider"></div>
      <div class="noticedetail-content-word flexcenter">
        <div v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const title = router.currentRoute.value.query.title;
    const time = router.currentRoute.value.query.time;
    const html = `<p style="text-indent: 2em;">新华财经上海3月14日电（谈瑞）13日，从上海市交通委获悉，上海市交通委员会、上海市人力资源和社会保障局决定，授予中华人民共和国洋山港海事局等49个集体“上海国际航运中心建设先进集体”称号；授予蔡永福等99名同志“上海国际航运中心建设先进个人”称号。其中，中国经济信息社上海中心指数业务部获评“上海国际航运中心建设先进集体”称号。</p><p style="text-align: justify; text-indent: 2em;">为进一步服务国家经济发展战略，中国经济信息社2024年1月在上海设立上海总部，围绕建设“国家级经济信息旗舰”目标，聚焦上海市加快建设“五个中心”重要使命，充分发挥中经社建设运营多个国家级信息平台的优势，为上海“五个中心”建设丰富市场要素赋能。</p><p style="text-align: justify; text-indent: 2em;">为进一步服务国家经济发展战略，中国经济信息社2024年1月在上海设立上海总部，围绕建设“国家级经济信息旗舰”目标，聚焦上海市加快建设“五个中心”重要使命，充分发挥中经社建设运营多个国家级信息平台的优势，为上海“五个中心”建设丰富市场要素赋能。</p><p style="text-align: justify; text-indent: 2em;"><a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>是我国第一家全国性的国有股份制商业银行，总部设在上海，战略目标是“建设具有特色优势的世界一流银行集团”。2023年，按《银行家》杂志（The Banker）公布的一级资本排名，<a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>居全球银行第九位。“十四五”时期，<a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>坚定推进“一四五”战略，即以战略目标为引领，打造普惠金融、贸易金融、科技金融、财富金融四大业务特色，并把绿色金融作为全集团业务经营发展的底色，提升客户经营、科技引领、风险管理、协同作战、资源配置五大专业能力。</p><p style="text-align: justify; text-indent: 2em;"><a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>是我国第一家全国性的国有股份制商业银行，总部设在上海，战略目标是“建设具有特色优势的世界一流银行集团”。2023年，按《银行家》杂志（The Banker）公布的一级资本排名，<a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>居全球银行第九位。“十四五”时期，<a href="//www.cnfin.com/quote/stockdetail/index.html?code=601328.SS&amp;codeName=交通银行&amp;type=5&amp;crumb=股票,交通银行&amp;announ=lc" target="_blank" style="color:#3875B0;">交通银行</a>坚定推进“一四五”战略，即以战略目标为引领，打造普惠金融、贸易金融、科技金融、财富金融四大业务特色，并把绿色金融作为全集团业务经营发展的底色，提升客户经营、科技引领、风险管理、协同作战、资源配置五大专业能力。</p>`
    return {
      title,
      time,
      html
    };
  },
};
</script>
<style scoped lang='less'>
.mid-content {
  padding: 15px 34px;
  .noticedetail-content {
    background: #fff;
    min-height: calc(100vh - 190px);
    .noticedetail-content-title {
      color: #000;
      font-size: 30px;
      font-weight: 700;
      justify-content: center;
      padding-top: 52px;
    }
    .noticedetail-content-info {
      color: #757575;
      font-size: 16px;
      justify-content: center;
      padding-top: 30px;
      .sx {
        width: 1px;
        height: 17px;
        background: #757575;
        margin: 0 24px;
      }
    }
    .mid-divider{
      color: #757575 !important;
      height: 2px;
      margin-top: 13px;
    }
    .noticedetail-content-word{
      padding: 0 110px;
      margin-top: 53px;
      color: #000;
      font-size: 18px;
    }
  }
}
</style>
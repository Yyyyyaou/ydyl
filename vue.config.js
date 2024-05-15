const path = require('path')
module.exports = {
  publicPath:'./',
  configureWebpack:{
    resolve: {  
      alias: { 
        '@': path.resolve(__dirname, 'src'),  
        'ROOT_URL': __dirname,
        // 添加其他别名...  
      } 
    }  
  },
  //处理const app = createApp(App)
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },
  devServer:{
    port:3100,
    https:false,
    proxy:{
      '/api':{
        ws:false,
        target:'http://192.168.201.68:8090',//连上vpn后服务接口地址
        // target:'http://172.27.37.171:8090',//连袁冰本地服务接口地址
        // target:'http://172.27.40.63:8899',//连呈雪飞本地服务接口地址

        changeOrigin:true,//开启代理： 在本地会创建一个虚拟服务端，然后发送请求数据，并且同时接收请求数据，这样客户端和服务端进行数据的交互就不会有跨域问题
        pathRewrite:{
          '^/api':''
        }
      }
    }
  },
}

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

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
    });

    config.optimization.minimize(true);
    config.optimization.minimizer('terser').use(TerserPlugin, [{
      terserOptions: {
        compress: {
          drop_console: true, // 移除console.log
          drop_debugger: true, // 移除debugger
        },
        output: {
          comments: false, // 移除所有注释
        },
      },
    }]);


  },
  devServer:{
    port:3100,
    https:false,
    proxy:{
      '/api':{
        ws:false,
        // target:'http://192.168.201.68:8090',//连上vpn后服务接口地址
        // target:'http://192.168.200.7',//连上vpn后 公司环境容器内应用
        // target:'http://172.27.37.171:8090',//连袁冰本地服务接口地址
        target:'http://192.168.137.1:8899',//连程雪飞本地服务接口地址

        changeOrigin:true,//开启代理： 在本地会创建一个虚拟服务端，然后发送请求数据，并且同时接收请求数据，这样客户端和服务端进行数据的交互就不会有跨域问题
        pathRewrite:{
          '^/api':''
        }
      },
      '/webSocket':{
        // target:'ws://192.168.137.1:8090/',
        target:'ws://192.168.200.7/',
        ws:true,//开启ws
        changeOrigin:true,
        pathRewrite:{
          '^/webSocket':'/'
        }
      }
    },

  },

}

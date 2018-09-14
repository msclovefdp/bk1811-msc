const config={
	htmloptions:{
		removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
   },
   serveroptions:{
   		root: './dist',
    	port: 8000,
    	livereload: true
   },
   pages:['fdp','index','list','msc','shopCar'],
   cssoptions:{
   		'index':{
   			'common':[
   				'./src/stylesheets/reset.scss',
   				'./src/views/index/stylesheets/common/*.scss'
   		     ],
   			'index':'./src/views/index/stylesheets/index/*.scss'
   		},
   		'list':{
   			'list':[
				'./src/stylesheets/reset.scss',
				'./src/views/list/stylesheets/*.scss'
   			]
   		}
   },
   jsoptions:{
   		'index':{//首页入口
			index:'./src/views/index/javascripts/index.js',
			vendor:'./src/views/index/javascripts/vendor.js'
   		},
   		'list':'./src/views/list/javascripts/list.js'
   }
	
}
	module.exports=config

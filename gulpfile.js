const gulp=require('gulp');
const htmlmin=require('gulp-htmlmin')
const config=require('./config')
const connect=require('gulp-connect')
const concat=require('gulp-concat')
const minifycss=require('gulp-minify-css')
const autoprefixer=require('gulp-autoprefixer')
const rename=require('gulp-rename')
const merge=require('merge-stream')
const webpack=require('webpack-stream')
const inject=require('gulp-inject')
const sass=require('gulp-sass')
gulp.task('handle:html',function(){
	return gulp.src('./src/views/*/*.html')
//		.pipe(htmlmin(config.htmloptions))
		.pipe(gulp.dest('./dist'))
})
//处理css的任务：合并css，压缩css，前缀，输出
gulp.task('handle:css',function(){
	let streams=[]
	for(const page in config.cssoptions){
		for(const file in config.cssoptions[page]){
			let stream=gulp.src(config.cssoptions[page][file])
			   .pipe(sass())//把scss换成css
			   .pipe(autoprefixer({
           			browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
            		cascade: false, //是否美化属性值 默认：true 像这样：
            		//-webkit-transform: rotate(45deg);
            		//        transform: rotate(45deg);
            		remove:true //是否去掉不必要的前缀 默认：true 
        		}))
				.pipe(concat(file+'.css'))
				.pipe(minifycss())
				.pipe(rename({suffix:'.min'}))
				.pipe(gulp.dest('./dist/'+page+'/css'))
			streams.push(stream)//把当前的文件流存储到数组中
		}
	}
	return merge(...streams)//合并多个文件流
})
//处理js es6编译成cs5 合并    压缩
gulp.task('handle:js',function(){
	//return gulp.src('src/entry.js')
		//.pipe(webpack({
			//mode:'production',//设置打包模式none/development/production
			//单入口
			/*entry:'./src/views/fdp/javascripts/index.js',//入口
			output:{
				filename:'index.js'
			}*/
			//多入口单出口
			/*entry:['./src/views/fdp/javascripts/index.js','./src/views/fdp/javascripts/vendor.js'],//入口
			output:{
				filename:'index.js'
			}*/
			//多入口多出口
			//entry:{
				//index:'./src/views/fdp/javascripts/index.js',
				//vendor:'./src/views/fdp/javascripts/vendor.js'
			//},//入口
			//output:{
				//filename:'[name].min.js'
			//}
		//}))
		//.pipe(gulp.dest('./dist/fdp/js'))
		let streams=[]
		for(const page in config.jsoptions){
			let entry=config.jsoptions[page]
			let filename=Array.isArray(entry)||((typeof entry)==='string')?page:'[name]'
			let stream=gulp.src('src/entry.js')
				.pipe(webpack({
					mode:'production',
					entry:entry,
					output:{filename:filename+'.min.js'},
					module:{
						rules:[
							{
								test:/\.js$/,
								loader:'babel-loader',
								query:{
									presets:['es2015']
								}
							}
						]
					}
				}))
				.pipe(gulp.dest('./dist/'+page+'/js'))
			streams.push(stream)
		}
	return merge(...streams)
})

//专门给各个页面的html文件添加依赖
gulp.task('inject', function () {
	setTimeout(()=>{
		config.pages.forEach(page=>{		
		  	var target = gulp.src('./dist/'+page+'/'+page+'.html');
		  	// It's not necessary to read the files (will speed up things), we're only after their paths:
		  	var sources = gulp.src(['./dist/'+page+'/js/*.js', './dist/'+page+'/css/*.css'], {read: false});
		 
		  	return target.pipe(inject(sources,{ignorePath:'/dist'}))
		    			 .pipe(gulp.dest('./dist/'+page+''));
		})
	},1000)
});


//
gulp.task('watch',function(){
	gulp.watch('./src/views/*/*.html',['handle:html','inject','reload'])
	gulp.watch('./src/**/*.scss',['handle:css','inject','reload'])
	//通配符中*指的是儿子这一代，**指的是所有的后代
	gulp.watch('./src/**/*.js',['handle:js','inject','reload'])
	
})
gulp.task('server',function(){
	connect.server(config.serveroptions);
})

gulp.task("reload", function(){
	return gulp.src("./dist/**/*.html")
		.pipe(connect.reload());
})

gulp.task('default',['server','handle:html','handle:css','handle:js','inject','watch'])

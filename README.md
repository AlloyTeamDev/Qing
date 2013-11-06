### Qing

面向亿万用户级的移动Web前端开发模版

1. 移动端先行，同时保证在桌面端的可用性
2. 基于ES5
3. 足够轻量
4. 基于AMD(requirejs)的模块化JavaScript开发
5. 自动构建

### 模版结构

基础的文件目录结构：
```
.
├── css
│   ├── main.css
│   └── normalize.css
├── img
├── js
│   ├── main.js
│   └── vendor
├── .editorconfig
├── index.html
└── Modfile
```

### 构建过程

安装Node环境后使用NPM安装[Mod](http://madscript.com/modjs/):
```sh
$ npm install modjs -g
```

成功安装后, 进入Modfile所在的目录，执行mod：
```sh
$ mod build
```

Mod默认会在当前目录下生成dist目录输出构建后的结果。

### 性能优化

浏览器第一次请求服务器的过程至少需经过3RTTs：DNS域名解析1RTT；TCP连接建立1RTT；HTTP请求并且返回第一个比特的数据1RTT。而这在移动基站网络下请求则显得异常缓慢，在我们的监测中，在2G网络下仅DNS时间即可达到200ms，性能不容乐观。所以尽可能快的完成页面加载在移动端显得更加重要，而如何合理的减少页面初始资源请求数是加快页面加载最有效的方式：

#### 合并CSS @imports

在页面中引入了样式文件`css/main.css`：
```html
<link rel="stylesheet" href="css/main.css">
```
而 `css/main.css`中使用了CSS`@import`机制来引入其他模块的样式文件：
```css
@import "foo.css";
@import "bar.css";
@import "baz.css";
```
使用CSS原生`@import`机制模块化开发CSS是Qing推荐的方式，然不做优化直接发布到线上必然有性能问题，这是绝不允许的。

Qing在构建的时候会自动侦测所有引入的样式文件是否使用了`@import`，并进行合并优化。

#### 合并连续引入资源

当页面中引入了多个样式文件或脚本文件：
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/typo.css">
<link rel="stylesheet" href="css/main.css">

<script src="js/fastclick.js"></script>
<script src="js/spin.js"></script>
<script src="js/main.js"></script>
```

构建程序会将多个连续的静态资源文件进行合并：
```html
<link rel="stylesheet" href="css/89ef9b6e.base_main_3_630.css">

<script src="js/89ef9b6e.fastclick_main_3_520.js"></script>
```

#### data-stand-alone配置

有时要求某个基础库文件如jQuery能被不同页面复用引入，而不是分别被打包在页面级别的资源包内，如此利用浏览器天然的缓存机制使无需重新请求相同的资源内容，Qing在默认构建约定的基础上同时提供了基于DOM的`data-stand-alone`配置。

```html
<script data-stand-alone src="vendor/jquery-2.0.3.js"></script>
<script src="js/foo.js"></script>
<script src="js/bar.js"></script>
<script src="js/baz.js"></script>
```

构建结果：
```html
<script data-stand-alone src="vendor/92cf6237.jquery-2.0.3.js"></script>
<script src="js/92cf6237.foo_baz_3_168.js"></script>
```

#### data-group配置

如何重复利用浏览器的并发请求数但同时考虑不至于有过多请求数上的负载，在不同场景下优化策略会有不同：当需兼容IE老版本的情况下，初始并发请求数不推荐超过2个，但同时我们推荐单个资源包的大小Gzip前不超过200k，所以通常如何来控制打包粒度是需要监控数据来支撑的。Qing在构建中提供了`data-group`分组参数来辅助打包粒度的控制：

```html
<script data-group=1 src="js/foo.js"></script>
<script data-group=1 src="js/bar.js"></script>
<script data-group=1 src="js/baz.js"></script>
<script data-group=2 src="js/qux.js"></script>
<script data-group=2 src="js/quux.js"></script>
<script data-group=2 src="js/corge.js"></script>
```

构建结果：
```html
<script data-group=1 src="js/92cf6237.foo_baz_3_168.js"></script>
<script data-group=2 src="js/090430cf.qux_corge_3_171.js"></script>
```

#### data-url-prepend配置

资源CDN化是基本的优化策略，

```html
<html data-url-prepend="http://cdn1.qq.com/">
<script data-group=1 src="js/foo.js"></script>
<script data-group=1 src="js/bar.js"></script>
<script data-group=1 src="js/baz.js"></script>
<script data-group=2 data-url-prepend="http://cdn2.qq.com/" src="js/qux.js"></script>
<script data-group=2 src="js/quux.js"></script>
<script data-group=2 src="js/corge.js"></script>
```

构建结果：
```
<html>
<script data-group=1 src="http://cdn1.qq.com/js/92cf6237.foo_baz_3_168.js"></script>
<script data-group=2 src="http://cdn2.qq.com/js/090430cf.qux_corge_3_171.js"></script>
```

#### 内嵌静态资源

所谓减少请求数最优的目标就是没有请求，Qing提供了基于QueryString的`embed`配置使支持在构建时将静态资源内嵌于HTML中，如此便可优化至最理想的情况：只需下载必不可少的HTML资源文件。

##### 内嵌样式
```html
<link rel="stylesheet" href="css/base.css?embed">
<link rel="stylesheet" href="css/typo.css">
<link rel="stylesheet" href="css/main.css">
```
构建结果：
```html
<style>
css/base.css...
css/typo.css...
css/main.css...
</style>
```

##### 内嵌脚本

```html
<script src="js/fastclick.js?embed"></script>
<script src="js/spin.js"></script>
<script src="js/main.js"></script>
```
构建结果：
```html
<script>
js/fastclick.js...
js/spin.js...
js/main.js...
</script>
```

##### 内嵌图片

###### 内嵌CSS里
```css
#foo {
    background: url('../img/icon.png?embed') no-repeat;
    height: 24px;
    width: 24px
}
```
构建结果：
```css
#foo {
    background: url(data:image/png;base64,iVBORw0...) no-repeat;
    height: 24px;
    width: 24px
}
```

###### 内嵌HTML里
```html
<img src="./img/icon.png?embed">
```
构建结果：
```html
<img src="data:image/png;base64,iVBORw0...">
```

### 基础库

Modfile中默认配置了以下第三方库下载地址：

* FastClick
* Spin.js
* Zepto
* jQuery 1.x
* jQuery 2.x
* require.js 2.1.9
* requirejs-tmpl

```js
{
    options: {
        dest: "js/vendor/"
    },
    fastclick: {
        src: "https://raw.github.com/ftlabs/fastclick/master/lib/fastclick.js"
    },
    spin: {
        src: "https://raw.github.com/fgnass/spin.js/gh-pages/dist/spin.js"
    },
    zepto: {
        src: "http://zeptojs.com/zepto.js"
    },
    jquery1: {
        src: "http://code.jquery.com/jquery-1.10.2.js"
    },
    jquery2: {
        src: "http://code.jquery.com/jquery-2.0.3.js"
    },
    requirejs: {
        src: "http://requirejs.org/docs/release/2.1.9/comments/require.js"
    },
    tmpl: {
        src: "https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js"
    }
}
```

下载全部库至本地：
```sh
$ mod vendor
```

如只需下载Zepto：

```sh
$ mod download:zepto
```

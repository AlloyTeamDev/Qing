## Qing

为什么有Qing？笔者微微转头凝视着旁边的女开发同事...思考片刻后决定还是这样写: 作为业内领先的前端团队，回馈社区助力移动Web的发展是我们的责任与义务。
为什么是Qing？因其足够Qing量，只需30分钟内即可掌握最先进的Web开发技能。
Qing是一套基础开发模版，来源于我们在手机与PC端上的大量工程实践。Qing所提供不是冷冰冰的文件，而是一套Web前端解决方案，
所以Qing不只是关注项目的初始状态，而是整体的工作流程，这是Qing与现有开源的开发模版显著差异的一点。Qing的体验必须是
高效且愉悦的，拒绝繁琐与重复。以下是Qing所基于的开发理念：

1. 移动端优先，兼容PC端
2. 向前看齐，基于ES5开发
3. 模块化Web开发过程
4. 自动构建与部署集成, 基于Mod.js工具

基于未来趋势的开发理念，Qing旨在提供工程化方案。

平台与浏览器版本兼容：

* iOS 4.0+
* Android 2.2+
* IE 6+
* Chrome
* Firefox
* Safari

### 开始使用

可以通过以下任意一种方式开始使用Qing模版：

1. [下载最新Qing模版包](https://github.com/AlloyTeam/Qing/archive/master.zip), 解压至目标目录

2. 如果已安装git，可使用git clone源码至目标目录：
```sh
$ git clone https://github.com/AlloyTeam/Qing.git
```

3. 如果已安装了Mod.js, 推荐在目标目录执行：
```sh
$ m download AlloyTeam/Qing
```
第一次使用`m download`命令，需要先安装`mod-tar`插件：
```sh
$ npm install mod-tar -g
```

4. 如果您是一位女开发，请忽略下文直接联系笔者，深圳优先。

### 模版结构

团队的协作离不开一些基本的约定，Qing约定以下文件目录结构：
```
.
├── css
│   ├── main.css
│   └── normalize.css
├── img
├── js
│   ├── main.js
│   └── vendor
├── tpl
├── .editorconfig
├── index.html
└── Modfile.js
```

* 目录`css`托管样式文件
* 目录`img`托管图片文件
* 目录`js`托管JavaScript文件
* 目录`tpl`托管模版文件
* `.editorconfig`约定团队基础代码风格
* `index.html`是入口HTML文件
* `Modfile.js`是Mod.js配置文件

### 模块化编程指引

Qing推荐模块化的开发过程，模块化开发后无论在代码可维护性与复用，还是团队协作上都将变的更加直观、轻松与高效。

#### CSS模块化

通过原生CSS内置的@import机制管理CSS模块，在构建过程中会自动合并压缩（在下文的优化章节也有说明）：

```css
@import "normalize.css";
@import "widget1.css";
@import "widget2.css";
@import "widget3.css";
```

#### JS模块化

约定引入AMD规范来管理JS模块，关于第一次接触AMD的读者，笔者推荐可以先Google了解后再进行下一步：

```js
// main.js
define(["./app"], function(app){
    app.init()
})
```

```js
// app.js
define(function(){
    return {
        init: function(){}
    }
})
```

#### HTML模块化

HTML模块指代HTML模版文件，通过`requirejs-tmpl`插件将HTML分模块管理，`requirejs-tmpl`没有默认打包在Qing模版中，可手动下载
[requirejs-tmpl](https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js)插件至js目录，或通过执行`m download:tmpl`
命令自动安装插件：

```html
<!-- tpl/headerTpl.html -->
<header><%= title %></header>
<!-- HTMl模版可依赖其他HTML模块 -->
<%@ ./navTpl.html %>
```

```html
<!-- tpl/navTpl.html -->
<a href="<%= url %>">View On Github</a>
```

```html
<!-- tpl/footerTpl.html -->
<footer><%= copyright %></header>
```

在HTML模版的引入是基于`requirejs`的插件机制，所以在具体路径前需加上`tmpl!`前缀，表示其是HTML模版，例如：`tmpl!../tpl/headerTpl.html`。
引用的模版已通过插件自动编译，得到的函数如`headerTpl`直接传入需要绑定的数据即可：

```js
// js/app.js
define(["tmpl!../tpl/headerTpl.html", "tmpl!../tpl/footerTpl.html"], function(headerTpl, footerTpl){
    var html1 = headerTpl({title: "Hello Qing", url: "http://github.com/AlloyTeam/Qing"})
    var html2 = footerTpl({copyright: "AlloyTeam"})
    // balabala
})
```

### 自动化工具的环境安装

1. 安装[Node.js](http://nodejs.org/)

2. 安装[Mod.js](http://madscript.com/modjs/)

Mod.js是基于Node.js的工作流工具，安装Node.js环境后使用NPM安装Mod.js:
```sh
$ npm install modjs -g
```

### 一键构建

成功安装Mod.js后, 进入Modfile所在的项目根目录，只需执行`m`命令，一切如此简单，如假包换的一键构建：
```sh
$ m
```
执行完成后会在当前目录下生成`dist`目录输出构建后的结果。

### 性能优化

浏览器第一次请求服务器的过程至少需经过3RTTs：DNS域名解析1RTT；TCP连接建立1RTT；HTTP请求并且返回第一个比特的数据1RTT。
而这在移动基站网络下请求则显得异常缓慢，在我们的监测中，在2G网络下仅DNS时间即可达到200ms，性能不容乐观。
所以尽可能快的完成页面加载在移动端显得更加重要，而如何合理的减少页面初始资源请求数是加快页面加载最有效的方式：

#### 合并JS模块
Qing支持传统的手动模块加载管理与基于AMD的模块加载管理方式，同时我们推荐使用Require.js作为开发过程中的模块加载工具。

```html
<!-- JS模块模块手动管理 -->
<script src="js/fastclick.js"></script>
<script src="js/spin.js"></script>
<script src="js/main.js"></script>
```
传统的手动添加模块会自动合并，其按照合并连续引入资源的规则进行，最终输出：
```html
<script src="js/89ef9b6e.fastclick_main_3_520.js"></script>
```

```html
<!-- data-main属性值为执行入口JS文件地址 -->
<script data-main="js/main" src="http://requirejs.org/docs/release/2.1.6/minified/require.js"></script>
```
通过模块加载器方式，Qing会自动移除模块加载器本身，其并不打包进最终输出的文件：
```html
<script src="js/89ef9b6e.main.js"></script>
```

Qing默认开启的是移除`define`生成模块管理器无依赖代码的`stripDefine`优化模式。`stripDefine`优化模式的配置在`Modfile.js`的build任务中：

```js
build: {
    src: "./index.html",
    stripDefine: true,
    varModules: ['tpl']
}
```

在`stripDefine`优化模式下，基于AMD规范文件：

```js
// js/foo.js
define(function(){
    var foo = "foo"
})
```

```js
// js/bar.js
define([./foo], function(){
    var bar = "bar"
})
```

会优化为：

```js
(function(window, undefined){
    var foo = "foo";
    var bar = "bar"
})(this)
```

以上AMD模块间只是引入其他模块的代码，并未有依赖其他模块暴露的接口。当有接口依赖时，则需使用`varModules`配置项，
用来指定哪些目录下的AMD模块有暴露接口，`varModules`默认已配置`tpl`模版目录下的HTML模块必然会暴露接口。通过示例代码进一步说明`varModules`：

```js
// base/clone.js
define(function(){
    return function(obj){
        return Object.create(obj)
    }
})
```

```js
// main.js
define(['./base/clone'], function(clone){
    var foo = clone({bar:1})
})
```

`main.js`依赖`base/clone.js`通过return暴露的接口，如不指定`varModules`，默认只移除define则会生成以下有问题的代码：

```js
(function(window, undefined){
    return function(obj){
        return Object.create(obj)
    };
    var foo = clone({bar:1})
})(this)
```

如在`varModules`参数中指定base目录，同时约定模块的文件名与接口名一致，即`base/clone.js`的文件名是clone，在引用关系中接口名也需是clone：

```js
build: {
    src: "./index.html",
    stripDefine: true,
    varModules: ['tpl'，'base']
}
```

此时会在移除define的同时将模块代码转换为变量声明格式的代码：

```js
(function(window, undefined){
    var clone = function(obj){
        return Object.create(obj)
    };
    var foo = clone({bar:1})
})(this)
```

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

#### data-rev配置

Qing会自动给所有优化后的静态资源加上类似 `89ef9b6e.` 的指纹标示前缀来区分版本，此行为是默认打开，
可以通过`data-no-rev`声明来关闭，也可以`data-rev`声明开启。

```html
<html data-no-rev>
<link rel="stylesheet" href="css/main.css">
<script data-rev src="js/main.js"></script>
<img src="img/foo.png">
```

如上通过在HTML标签中`<html data-no-rev>`设置全局的策略，同时可在具体的标签上覆盖全局设置，如上构建后的结果：

```html
<html>
<link rel="stylesheet" href="css/main.css">
<script src="js/89ef9b6e.main.js"></script>
<img src="img/foo.png">
```

#### data-stand-alone配置

有时要求某个基础库文件如jQuery能被不同页面复用引入，而不是分别被打包在页面级别的资源包内，
如此利用浏览器天然的缓存机制使无需重新请求相同的资源内容，
Qing在默认构建约定的基础上同时提供了基于DOM的`data-stand-alone`配置。

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

如何重复利用浏览器的并发请求数但同时考虑不至于有过多请求数上的负载，在不同场景下优化策略会有不同：
当需兼容IE老版本的情况下，初始并发请求数不推荐超过2个，但同时我们推荐单个资源包的大小Gzip前不超过200k，
所以通常如何来控制打包粒度是需要监控数据来支撑的。Qing在构建中提供了`data-group`分组参数来辅助打包粒度的控制：

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

所谓减少请求数最优的目标就是没有请求，Qing提供了基于QueryString的`embed`配置使支持在构建时将静态资源内嵌于HTML中，
如此便可优化至最理想的情况：只需下载必不可少的HTML资源文件。

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

Qing总是想法设法的让开发过程更自动更流畅，在Qing模版的`Modfile.js`中提供了以下第三方库的下载配置：

* FastClick
* Spin.js
* Zepto
* jQuery 1.x
* jQuery 2.x
* require.js 2.1.9
* requirejs-tmpl

截取`Modfile.js`中关于第三方库的配置，src表示源地址，dest表示下载目录，
除了tmpl插件下载至`js/`目录其他所有第三方库都默认下载至`js/vendor/`目录：

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
        dest: 'js/',
        src: "https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js"
    }
}
```

下载全部库至本地方式非常简单，只需在根目录下执行：
```sh
$ m vendor
```

如只需下载Zepto：

```sh
$ m download:zepto
```

### 社区

需求、改进与建议，可在[Github issues](https://github.com/AlloyTeam/Qing/issues)提单，会一一解答。同时Qing是面向社区的开源项目，
邀请社区朋友共同参与贡献，如你觉得Qing很棒很酷，也可以帮助我们在微博与博客中推广与传播。

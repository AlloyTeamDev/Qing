### Qing

面向亿万用户级的移动端Web前端开发模版

### 特性
1. 移动端先行，同时保证在桌面端的可用性
2. 基于ES5
3. 足够轻量
4. 基于AMD(requirejs)的模块化JavaScript开发
5. 自动构建

### 构建

安装Node环境后使用npm安装Mod:
```sh
$ npm install mod -g
```

成功安装后, 进入Modfile所在的目录，执行mod：
```sh
$ mod build
```

Mod默认会在当前目录下生成dist目录输出构建后的结果。

### 库

Modfile中默认配置了以下第三方库下载地址：

* FastClick
* Spin.js
* Zepto
* jQuery 1.x
* jQuery 2.x

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
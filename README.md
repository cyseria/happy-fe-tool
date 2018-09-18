# happy-fe-tool

[![build status](https://img.shields.io/travis/cyseria/happy-fe-tool/master.svg?style=flat-square)](https://travis-ci.org/cyseria/happy-fe-tool)
[![Test coverage](https://img.shields.io/codecov/c/github/cyseria/happy-fe-tool.svg?style=flat-square)](https://codecov.io/github/cyseria/happy-fe-tool?branch=master)
[![NPM version](https://img.shields.io/npm/v/happy-fe-tool.svg?style=flat-square)](https://www.npmjs.com/package/happy-fe-tool)
[![NPM Downloads](https://img.shields.io/npm/dm/happy-fe-tool.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/happy-fe-tool)

一个方便自己使用的 fe 工具箱, 主要针对于一些基础工具的安装和配置

作为一个合格的程序员, 才懒得每新起项目就去 `npm i xxx -D` && `ctrl+c & ctrl+v` 呢 🌝

## Install
```
[sudo] npm install happy-fe-tool -g
```

## Usage

使用某个模板进行初始化, 使用 **空格** 进行选择

```bash
# init rules with tpl
happy init [tpl]

# options
-c, --config <dir>  设置配置信息的路径（默认在根目录）
-p, --package 将配置信息放入 package.JSON
-h, --help  获取帮助信息
```

单独添加某条规则或者某几条规则, 使用 -t 来添加模板, -y 使用默认的模板

```bash
# add single rule
happy add <rules...> [options]

# options
-t, --tpl <tpl>  指定模板
-y, --yes  使用默认的模板
-d, --dir <dir>  设置配置信息的路径（默认在根目录）
-p, --package 将配置信息放入 package.JSON
-h, --help  获取帮助信息
```

**examples:**

```bash
## would let user select config
happy add prettier

## use baidu config
happy add codelint -t baidu
```

## tools
### [nvm](https://github.com/creationix/nvm): Node Version Manager

把当前系统的 `node` 版本写入 `.nvmrc` 中

```bash
happy add nvm
```

### [prettier](https://github.com/prettier/prettier): An opinionated code formatter

将 `prettier` 的配置文件模板写入项目中, 配合编辑器使用味道最佳喔( can be run [in your edictor](https://prettier.io/docs/en/editors.html) on-save) ~

```bash
# 将 .prettierrc.js 放在根目录
happy add prettier
```

### commitizen

使用 [commitizen](https://github.com/commitizen/cz-cli) 和配置好的 [Adapters](https://github.com/commitizen/cz-cli#adapters) 来规范代码提交


```bash
# 将配置文件(.czrc, .cz-config.js) 放在根目录
happy add commitizen

# 将配置文件放在 package 配置中
happy add commitizen -d paxkage.json

# 将配置文件放在 ./config 目录下
happy add commitizen -d ./config
```

自动增加 `commit script`

```javascript
"scripts": {
    "commit": "git-cz"
},
```

### changelog

### codelint

### commitlint

### test

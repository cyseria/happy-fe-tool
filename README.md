# happy-fe-tool
一个方便自己使用的 fe 工具箱, 主要针对于一些基础工具的安装和配置

作为一个合格的程序员, 才懒得每新起项目就去 ``npm i xxx -D` && `ctrl+c & ctrl+v` 呢 🌝

## Install
```
[sudo] npm install happy-fe-tool -g
```

## Usage

使用某个模板进行初始化, 使用 **空格** 进行选择

```bash
# init rules with tpl
happy init [tpl]
```

单独添加某条规则或者某几条规则, 使用 -t 来添加模板

```bash
# add single rule
happy add <rule...> -t baidu

# example
happy add prettier
happy add codelint -t baidu
```
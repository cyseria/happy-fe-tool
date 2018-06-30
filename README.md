# happy-fe-tool
一系列 fe 小工具

## fecs

- 添加 fes-hook: 在 git 提交代码之前执行 fecs 检查, 减少 eslint xxx 的 commit

```
fe-tool fecs-hook --level 2
```


然后脚本会做的一些事

- pre-commit 自动拷贝到当前项目下的 .git/hooks/
- .fecsrc 检查和格式化规则配置文件自动拷贝到项目根目录
- .fecsignore 文件忽略配置文件自动拷贝到项目根目录

## git-cz 文件生成

提交格式化的 hook & 自定义 customizable

首先确保你装了 `commitizen`

```
npm i commitizen -g
```

npm i cz-customizable
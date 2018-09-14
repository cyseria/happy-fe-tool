/**
 * @file  prettier's rule in baidu, an opinionated code formatter, see https://github.com/prettier/prettier
 * @author
 */

module.exports = {
    printWidth: 120, // 每行最大120字符
    semi: true, // 末尾分号
    singleQuote: true, // 使用单引号
    bracketSpacing: false, // 禁止或强制在括号内使用空格
    tabWidth: 4, // 4 个空格缩进
    trailingComma: 'none' // 不允许尾逗号, 例如 [a,b,c,d,]
};

// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // 指定执行环境
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  /**
   * 规则
   * "off" or 0 - 关闭规则
   * "warn" or 1 - 将规则视为一个警告（不会影响退出码）
   * "error" or 2 - 将规则视为一个错误 (退出码为1)
   */
  rules: {
    // 禁止使用 var 声明变量，必须使用 let 声明变量 或 const 声明常量
    'no-var': 2,
    // 变量名与属性名使用驼峰写法，而不是下划线写法
    'camelcase': [2, {"properties": "always"}],
    // 声明变量的同时必须初始化
    'init-declarations': 2,
    // 使用 === 与 !== 进行比较。而不是 == 与 !=
    'eqeqeq': 2,
    // 字符串使用 单引号
    'quotes': [2, 'single'],
    // 禁止语句使用 ; 分号结尾，如果下一条语句以 [、(、/、+ 或 - 开头，在语句前补充一个 ;
    'semi': [2, 'never'],
    // 禁止多余的分号
    'no-extra-semi': 2,
    // 使用 unix 的换行风格 \n，而不是 windows 的 \r\n
    // 'linebreak-style': ['error', 'unix'],
    // 统一缩进使用2个空格
    'indent': [1, 2],
    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
    'array-bracket-spacing': [2, 'never'],
    // 禁止在 块外 访问在 块内 通过 var 声明的变量
    'block-scoped-var': 2,
    // 统一大括号形式 Java 风格
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    // 数组的最后一个元素或对象的最后一个属性之后不能带逗号
    'comma-dangle': [2, 'never'],
    // 控制逗号前后的空格，逗号前不能带空格，逗号后可以
    'comma-spacing': [2, {'before': false, 'after': true}],
    // 控制逗号在行尾出现还是在行首出现
    'comma-style': [2, 'last'],

    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // 在开发环境下允许 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

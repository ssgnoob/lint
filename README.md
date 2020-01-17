# jupiter-lint

## instruction

-   本库旨在 git precommit 时对提交文件进行 eslint 外的操作或提供更定制化的服务
-   目前实现的功能：
    -   remove:删除提交文件中的 console,debugger,alert 相关代码(基于 ast)
    -   lintWords:查找提交文件中是否包含指定文字，例如待修改，待删除(基于正则)
    -   vm:查找提交文件中的路由文件，检查是否包含对应版本的页面文件(基于 ast)
-   后续功能待开发

## How to use

```
yarn add @souche/jupiter-lint -D
```

## issue

See it => [**别点了，不会给你们提 issue 的机会的**]()

### Document

See [语雀](https://souche.yuque.com/hhr2ch/ocrgtw/hfa0hy).

### repository

See [gitlab](https://git.souche-inc.com/jupiter-f2e/jupiter-lint)

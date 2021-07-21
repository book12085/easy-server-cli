# Peace and Love

# 一、使用方式：

1. 全局安装
```javascript
npm i -g easy-server-cli
```

2. 创建项目
```javascript
esc create <name>
```

3. 运行项目
```javascript
cd <name> && npm start
```

4. 通过postman、postwoman、vscode中的postcode进行简单测试，确保项目运行正常
可以通过POST请求：http://localhost:5888/login 接口，输出code为0则一切正常。

# 二、说明
1. 该脚手架产生的目的：练手，方便自己平时使用。
2. 该脚手架目前支持koa2版本的服务开发，已经集成了一些较为常用的中间件，提供commonjs、es、ts三种，各位根据自己的喜好可以选择。
3. 该脚手架目前适合做一些小的后端api服务
4. 目前各中间件的配置都为大众化配置，如果有特殊需求，可以自行修改项目中的配置。

# 三、开发注意事项
1、目前项目使用了es进行module的导出和引入，在引入时，一定要使用全路径（详细到文件后缀名），例如：
```javascript
import { fileSuffix } from '../config/index.js';
```

# 四、声明：

> 新手练手脚手架，如果要用于生产，请保重。  :smile::smile::smile:

> 油腻胖子为了深入学习，粗手粗脚的写了这么一个脚手架。第一次出手，在这里接收各位同学的批评，也欢迎各位初学者加入，也欢迎大神加入，让其变的更加强壮。

# 五：TodoList

> 革命尚未成功，胖子仍需努力

- [ ] 1. 模板 - 增加eslint
- [ ] 2. 模版 - 远程模版
- [ ] 3. cli - 增加单元测试
- [ ] 4. cli - 增加eslint
- [ ] 5. cli - 增加express的支持
- [ ] 6. cli - 逻辑优化
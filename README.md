# koa-galen

该项目是为了解决swagger项目文档集成的koa扩展框架，目前存在诸多不合理的地方。

## 项目结构

* __tests__
* app
  * controller
  * models
  * service
* config
  * config.default.js
  * config.prod.js
  * config.test.js
* docs
  * model.md
* framework
  * models
    * createModel.js
    * crudRemoteMethods.js
    * relations.js
    * validateConfig.js
  * baseController.js
  * bindPropertiesToCtx.js
  * buildModels.js
  * buildSwaggerDoc.js
  * classLoader.js
  * common.js
  * dynamicRouter.js
  * index.js
  * inutializeApp.js
  * parseQueryFilter.js
* middleware
* server.js
* package.json

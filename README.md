# yyds-cli
简易脚手架工具

实现功能：
1. 查看版本信息
2. 查看升级信息
3. 快速生成页面
4. 配置与查看模板默认路径

#### 快速安装与使用

~~~shell
npm i -g yyds-cli
~~~

#### 查看脚手架版本号

~~~shell
yyds -v
yyds --version
~~~

#### 查看脚手架升级信息
~~~shell
yyds upgrade
~~~

#### 快速生成页面
目前支持两种模板
- table
- report

`yyds g <name>` 默认生成列表模板，可以带参数`-t <模板名>`，选择要生成列表文件还是报告文件
如果项目目标目录有重名的文件，则会进行提示，选择是否要覆盖，取消则不会进行写入，选择`Overwrite`则会覆盖目标目录下的文件，可以在输入命令时带上`--force`，强行进行覆盖

~~~shell
yyds g index
yyds g index/index
yyds g index/index -t table
yyds g index/index -t report
yyds g index/index -t table --force
~~~

#### 支持设置文件生成的默认路径

默认生成list`.vue`的文件路径为`src/renderer/page/manage/desk`
`.js`的文件路径为`src/renderer/page/manage/desk`

report`.vue`的文件路径为`src/renderer/page/manage/report`
`.js`的文件路径为`src/renderer/models/report`

若想修改默认路径，可以通过如下命令
~~~shell
yyds m listvue <路径>
yyds m listjs <路径>
yyds m reportvue <路径>
yyds m reportjs <路径>
~~~

修改完之后，如想查看配置信息，则使用一下命令
~~~shell
yyds config
~~~
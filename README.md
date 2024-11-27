# ChiralDetection_Web

1. index.html文件中有两处文字或图片等介绍信息，根据需要删改

2. 每个php文件中都有python接口，实际应用前需根据模型路径修改shell_exec中的命令，注意路径一定要正确

3. 如果某些功能返回到前端的是文字而不是图片，可修改script.js文件中154-166行，用state.btn增加对应功能的特判，同时修改php文件中的返回值

4. py文件夹中为开发时临时编写的python文件，供对应的php调用测试，可删除

5. 运行环境配置：开发环境为phpstudy 8.1.1.3提供的Apache 2.4.39；phpstudy官网：https://www.xp.cn/php-study

6. 配置好Apache环境后，将本项目的cdw文件夹置于localhost路径下，即可访问网站首页http://localhost/cdw/index.html

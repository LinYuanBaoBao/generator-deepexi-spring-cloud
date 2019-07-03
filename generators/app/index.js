'use strict'

const path = require('path');

const obj = {
  groupId: {
    prompting: { type: 'input', message: '请输入你的group id', default: 'com.deepexi' },
    option: { desc: 'group id', type: String, default: 'com.deepexi' }
  },
  artifactId: {
    prompting: { type: 'input', message: '请输入你的artifact id', default: 'deepexi-spring-cloud' },
    option: { desc: 'artifact id', type: String, default: 'deepexi-spring-cloud' }
  },
  basePackage: {
    prompting: { type: 'input', message: '请输入你的基础包路径（为空则使用group id）' },
    option: { desc: '基础包路径（为空则使用group id）', type: String, default: '' }
  },
  mavenUrl: {
    prompting: { type: 'input', message: '请输入你的maven仓库地址', default: 'http://nexus.deepexi.top/repository/maven-public/' },
    option: { desc: 'maven仓库url', type: String, default: 'http://nexus.deepexi.top/repository/maven-public/' }
  },
  db: {
    prompting: {
      type: 'list',
      choices: [
        'mysql',
        'none'
      ],
      message: '请选择你使用的数据库'
    },
    option: { desc: '数据库', type: String, default: 'none' },
    child: {
      dbPool: {
        prompting: {
          type: 'list',
          choices: [
            'druid',
            // 'hikari',
            'default'
          ],
          message: '请选择你使用的数据库连接池'
        },
        option: { desc: '数据库连接池', type: String, default: 'none' },
        callbacks: {
          trigger (answers) {
            return answers.db === 'mysql';
          }
        }
      },
      orm: {
        prompting: {
          type: 'list',
          choices: [
            'mybatis-plus',
            'mybatis',
            'none'
          ],
          message: '请选择你使用的ORM框架'
        },
        option: { desc: 'ORM框架', type: String, default: 'none' },
        callbacks: {
          trigger (answers) {
            return answers.db === 'mysql';
          }
        }
      }
    }
  },
  discovery: {
    prompting: {
      type: 'list',
      choices: [
        'eureka',
        // 'zookeeper',
        'none'
      ],
      message: '请选择你使用的注册中心类型'
    },
    option: { desc: '注册中心', type: String, default: 'eureka' },
    child: {
      circuit: {
        prompting: {
          type: 'list',
          choices: [
            'hystrix',
            // 'sentinel',
            'none'
          ],
          message: '请选择你的熔断框架类型（TODO）'
        },
        option: { desc: '熔断降级', type: String, default: 'hystrix' }
      }
    }
  },
  configservice: {
    prompting: {
      type: 'list',
      choices: [
        'apollo',
        'none'
      ],
      message: '请选择你的配置中心类型（TODO）'
    },
    option: { desc: '配置中心', type: String, default: 'none' }
  },
  demo: {
    prompting: {
      type: 'confirm',
      message: '是否为你生成相关的demo文件（默认No）',
      default: false
    },
    option: { desc: '生成demo', type: Boolean, default: false }
  }
}

module.exports = require('yo-power-generator').getGenerator(obj, {
  handlerDir: path.join(__dirname, 'handler'),
  templateDir: path.join(__dirname, 'templates'),
  afterPropsSet (props) {
    if (!props.basePackage) {
      props.basePackage = props.groupId;
    }
    props.basePath = props.basePackage.replace(/\./g, '/');

    props.conditions = {};
    if (props.orm !== 'none') {
      props.conditions[props.orm] = true;
      if (props.demo) {
        props.conditions.crud = true;
      }
    }

    props.openfeign = props.discovery === 'eureka';
  }
});

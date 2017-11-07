'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'SpringBoot Microservice project ' + chalk.red('msg') + ' generator!'
    ));

    const prompts = [
      {
          type: 'string',
          name: 'bootVersion',
          message: 'Enter Spring Boot version:',
          default: '1.5.8.RELEASE'
      },
      {
          type: 'string',
          name: 'springCloudVersion',
          message: 'Enter spring cloud version',
          default: 'Dalston.SR4'
      },
      {
        type: 'string',
        name: 'springFoxVersion',
        message: 'Enter springfox version',
        default: '2.6.1'
      },
      {
          type: 'string',
          name: 'packageName',
          message: 'Enter default package name:',
          default: 'com.myapp'
      },
      {
          type: 'string',
          name: 'baseName',
          message: 'Enter base name of app:',
          default: 'app'
      }, 
      {
          type: 'string',
          name: 'javaVersion',
          message: 'Enter Java version:',
          default: '1.8'
      }, 
      {
          type: 'checkbox',
          name: 'packagingType',
          message: 'Package type:',
          choices: [
              {
                  name: 'Jar',
                  value: 'jar'
              }, {
                  name: 'War',
                  value: 'war'
              }
          ],
          default: 'jar'
      },
      {
          type: 'checkbox',
          name: 'buildTool',
          message: 'Select a build tool:',
          choices: [
              {
                  name: 'Gradle',
                  value: 'gradle'
              }, {
                  name: 'Maven',
                  value: 'maven'
              }
          ]
      },
      {
          type: 'checkbox',
          name: 'db',
          message: 'Select Data support:',
          choices: [
              {
                  name: 'Jdbc',
                  value: 'jdbc'
              }, 
              {
                  name: 'JPA',
                  value: 'jpa'
              }, 
              {
                  name: 'MySQL',
                  value: 'mysql'
              },
              {
                  name: 'MsSql',
                  value: 'mssql'
              }
              
          ]
      },
      {
          type: 'checkbox',
          name: 'nosql',
          message: 'Select NoSQL support:',
          choices: [
              {
                  name: 'Redis',
                  value: 'redis'
              },
              {
                  name: 'Elasticsearch',
                  value: 'elasticsearch'
              },
              {
                  name: 'Mongo',
                  value: 'mongo'
              },
              {
                  name: 'Cassandra',
                  value: 'cassandra'
              }
          ]
      },
      {
        type: 'checkbox',
        name: 'cloud',
        message: 'Select Spring Cloud support:',
        choices: [
          {
            name: 'Config Client',
            value: 'configclient'
          },
          {
            name: 'Eureka Discovery',
            value: 'eureka'
          },
          {
            name: 'Hystrix',
            value: 'hystrix'
          },
          {
            name: 'Ribbon',
            value: 'ribbon'
          },
          {
            name: 'Zipkin Client',
            value: 'zipkin'
          }
        ]
      },
      {
        type: 'string',
        name: 'imageName',
        message: 'Enter docker image name'
      },
      {
        type: 'string',
        name: 'registry',
        message: 'Enter docker registry path'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.bootVersion = props.bootVersion;
      this.springCloudVersion = props.springCloudVersion;
      this.springFoxVersion = props.springFoxVersion;
      this.packageName = props.packageName;
      this.baseName = props.baseName;
      this.javaVersion = props.javaVersion;
      this.registry = props.registry;
      this.imageName = props.imageName;

      var hasPackagingType = function(pt) {
          return props.packagingType.indexOf(pt) !== -1;
      };
      this.jar = hasPackagingType('jar');
      this.war = hasPackagingType('war');

      this.buildTool = props.buildTool;

      var hasNoSql = function(starter) {
          return props.nosql.indexOf(starter) !== -1;
      };
      this.es = hasNoSql("elasticsearch");
      this.mongo = hasNoSql("mongo");
      this.redis = hasNoSql("redis");
      this.cassandra = hasNoSql("cassandra");
      
      var hasDb = function(starter) {
          return props.db.indexOf(starter) !== -1;
      }
      this.mssql = hasDb("mssql");
      this.mysql = hasDb("mysql");
      this.jdbc = hasDb("jdbc");
      this.jpa = hasDb("jpa");

      var hasCloud = function(starter) {
        return props.cloud.indexOf(starter) !== -1;
      }
      this.configClient = hasCloud('configclient');
      this.eureka = hasCloud('eureka');
      this.hystrix = hasCloud('hystrix');
      this.zipkin = hasCloud('zipkin');
      this.ribbon = hasCloud('ribbon');
    });
  }

  writing() {
    mkdirp(this.baseName);
    var packageFolder = this.packageName.replace(/\./g, '/');
    var srcDir = this.baseName + '/src/main/java/' + packageFolder + '/';
    var testDir = this.baseName + '/src/test/java/' + packageFolder + '/';
    var controllerDir = srcDir + 'controller/';
    var apiDir = srcDir  + 'api/';
    var configDir = srcDir + 'configuration/';

    var resourceDir = this.baseName + '/src/main/resources/';

    if ('gradle' === this.buildTool[0]) {
      this.fs.copyTpl(
        this.templatePath('build.gradle'),
        this.destinationPath(this.baseName + '/build.gradle'),
        { 
          packageName: this.packageName,
          baseName: this.baseName,
          jar: this.jar,
          war: this.war,
          bootVersion: this.bootVersion,
          javaVersion: this.javaVersion,
          usesSpringCloud: this.usesSpringCloud,
          springCloudVersion: this.springCloudVersion,
          springFoxVersion: this.springFoxVersion,
          cassandra: this.cassandra,
          es: this.es,
          mongo: this.mongo,
          redis: this.redis,
          jpa: this.jpa,
          jdbc: this.jdbc,
          mysql: this.mysql,
          mssql: this.mssql,
          configClient: this.configClient,
          eureka: this.eureka,
          hystrix: this.hystrix,
          ribbon: this.ribbon,
          usesSpringCloud: true,
          zipkin: this.zipkin,
        }
      );
    }
    if ('maven' === this.buildTool[0]) {
      this.fs.copyTpl(
        this.templatePath('pom.xml'),
        this.destinationPath(this.baseName + '/pom.xml'),
        { 
          packageName: this.packageName,
          baseName: this.baseName,
          jar: this.jar,
          war: this.war,
          bootVersion: this.bootVersion,
          javaVersion: this.javaVersion,
          usesSpringCloud: this.usesSpringCloud,
          springCloudVersion: this.springCloudVersion,
          springFoxVersion: this.springFoxVersion,          
          cassandra: this.cassandra,
          es: this.es,
          mongo: this.mongo,
          redis: this.redis,
          jpa: this.jpa,
          jdbc: this.jdbc,
          mysql: this.mysql,
          mssql: this.mssql,
          configClient: this.configClient,
          eureka: this.eureka,
          hystrix: this.hystrix,
          ribbon: this.ribbon,
          usesSpringCloud: true,
          zipkin: this.zipkin
        }
      );
    }
    this.fs.copyTpl(
      this.templatePath('Application.java'),
      this.destinationPath(srcDir + 'Application.java'),
      { 
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('RFC3339DateFormat.java'),
      this.destinationPath(srcDir + 'RFC3339DateFormat.java'),
      { 
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('ApplicationTests.java'),
      this.destinationPath(testDir + 'ApplicationTests.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('ApiException.java'),
      this.destinationPath(apiDir + 'ApiException.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('ApiResponseMessage.java'),
      this.destinationPath(apiDir + 'ApiResponseMessage.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('NotFoundException.java'),
      this.destinationPath(apiDir + 'NotFoundException.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('SwaggerDocumentationConfig.java'),
      this.destinationPath(configDir + 'SwaggerDocumentationConfig.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('HomeController.java'),
      this.destinationPath(controllerDir + 'HomeController.java'),
      {
        packageName: this.packageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath(this.baseName + '/Dockerfile'),
      { 
        baseName: this.baseName 
      }
    );
    this.fs.copy(
      this.templatePath('entrypoint.sh'),
      this.destinationPath(this.baseName + '/entrypoint.sh')
    );
    if (this.configClient){
      this.fs.copyTpl(
        this.templatePath('bootstrap.yml'),
        this.destinationPath(resourceDir + "bootstrap.yml"),
        {
          baseName: this.baseName
        }
      );
    }else{
      this.fs.copyTpl(
        this.templatePath('application.yml'),
        this.destinationPath(resourceDir + "application.yml"),
        {
          baseName: this.baseName
        }
      )
    }
    this.fs.copyTpl(
      this.templatePath('build.sh'),
      this.destinationPath(this.baseName + '/build.sh'),
      {
        imageName: this.imageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('run.sh'),
      this.destinationPath(this.baseName + '/run.sh'),
      {
        imageName: this.imageName
      }
    );
    this.fs.copyTpl(
      this.templatePath('push.sh'),
      this.destinationPath(this.baseName + '/push.sh'),
      {
        imageName: this.imageName,
        registry: this.registry
      }
    );
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath(this.baseName + '/.gitignore')
    );
  }

  //install(){
  //  this.installDependencies({
  //    npm: true,
  //    bower: true
  //  }).then(() => console.log('Everything is ready!'));
  //}
};
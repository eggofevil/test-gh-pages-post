//Скрипт для управления пакетом gh-pages

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const ghpages = require("gh-pages");
const ghpagesCacheClean = require("gh-pages/bin/gh-pages-clean.js");

const deployType = process.argv[2]; //Определяем тип публикации - src для исходников bld для сборки
const remote = "origin"; //наименование удаленного репозитория (обычно origin)
const projectFolder = "."; //корень проекта
const srcFiles = ["*", "*!(node_modules)/*", ".*"];
const mainBranch = "master"; //основная ветка проекта в удаленном репозитории (обычно master) - сюда заливаем проект с исходниками
const buildFolder = "build"; //имя каталога финальной сборки
const ghPagesBranch = "gh-pages"; //ветка в которой публикуется финальная сборка (обычно gh-pages) - сюда заливаем сборку
const commitMessage = process.env.npm_config_message; //cообщение для коммита

// Deploy function
function deploy(dist, config) {
  ghpages.publish(dist, config, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    ghpagesCacheClean(); // чистим кэш (после предыдущей публиказии задача может вылетать с ошибкой)
  });
}

// Deploy config
const srcConfig = {
  src: srcFiles,
  remote: remote,
  branch: mainBranch,
};
const buildConfig = {
  remote: remote,
  branch: ghPagesBranch,
};

if (commitMessage) {
  srcConfig.message = commitMessage;
  buildConfig.message = commitMessage;
}

// run Deploy

switch (deployType) {
  case "src":
    deploy(projectFolder, srcConfig);
    break;
  case "bld":
    deploy(buildFolder, buildConfig);
    break;
  default:
    console.log(deployType);
    console.log("ERROR: Icorrect parameter of deploy type (deployType)!");
}

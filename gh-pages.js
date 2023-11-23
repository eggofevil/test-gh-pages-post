/* Пояснение к паттерну перечисления файлов и каталогов проекта (собираем все из корня проекта, кроме node_modules и .vscode)
["*!(node_modules)", "*!(node_modules)/*", ".*"] первая версия скорее всего неверная
["*", ".*", "*!(node_modules)/*"] скорее всего верная разбор:
  * - собирает все файлы (кроме начинающихся с .)
  .* - собирает все файлы начинающиеся с .
  *!(node_modules)/* - coбирает все папки кроме node-modules (кроме начинающихся с .)
*/
const ghpages = require("gh-pages");
const ghpagesCacheClean = require(".\\node_modules\\gh-pages\\bin\\gh-pages-clean.js");

const remote = "remote"; //наименование удаленного репозитория (обычно origin)
const projectFolder = "."; //корень проекта
const srcFiles = ["*", "*!(node_modules)/*", ".*"];
const mainBranch = "master"; //основная ветка проекта в удаленном репозитории (обычно master) - сюда заливаем проект с исходниками
const buildFolder = "build"; //имя каталога финальной сборки
const ghPagesBranch = "gh-pages"; //ветка в которой публикуется финальная сборка (обычно gh-pages) - сюда заливаем сборку

const buildConfig = {
  remote: remote,
  branch: ghPagesBranch,
};
const srcConfig = {
  src: srcFiles,
  remote: remote,
  branch: mainBranch,
};

function deploy(dist, config, nextDeploy) {
  ghpages.publish(dist, config, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    ghpagesCacheClean();
    if (nextDeploy) nextDeploy();
  });
}

function startDeploy(args) {
  if (args.includes("-b") && args.includes("-s")) {
    deploy(projectFolder, srcConfig, () => deploy(buildFolder, buildConfig));
  } else if (args.includes("-b")) {
    deploy(buildFolder, buildConfig);
  } else if (args.includes("-s")) {
    deploy(projectFolder, srcConfig);
  } else console.log("Incorrect parameters!");
}

startDeploy(process.argv.slice(2));

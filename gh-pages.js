const ghpages = require("gh-pages");
const ghpagesCacheClean = require(".\\node_modules\\gh-pages\\bin\\gh-pages-clean.js");

const buildFolder = "build";
const projectFolder = ".";

const buildConfig = {
  remote: "remote",
};
const srcConfig = {
  // src: ["src/*", "public/*"],
  // src: "*!(node_modules)/*",
  // src: ["**!(node_modules)", "src/*", "public/*"],
  src: ["*!(node_modules)"],
  remote: "remote",
  branch: "master",
};

function deploy(dist, config) {
  ghpages.publish(dist, config, (data) => {
    console.log(data.error);
    ghpagesCacheClean();
  });
}

function startDeploy(args) {
  //if (args.includes("-b")) deploy(buildFolder, buildConfig);
  if (args.includes("-s")) deploy(projectFolder, srcConfig);
}

startDeploy(process.argv.slice(2));

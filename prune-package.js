// Read the package.json file and remove the dependencies
// set the script.build to `ls`
import fs from "fs";
import path from "path";
const __dirname = process.env.PACKAGE_DIR;
const packagePath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
packageJson.dependencies = {};
packageJson.devDependencies = {};
packageJson.scripts.build = "ls";

// Write the package.json file
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), "utf8");
console.log("package.json pruned");

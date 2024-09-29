import * as prettier from "prettier";
import * as fs from "fs";
const path = require("path");

const prettierConfig = {
  parser: "typescript",
  plugins: ["../dist/index.js"],
};

let exitCode = 0;

const testRoot = path.resolve(__dirname);
let testDirectories: string[] = [];
fs.readdirSync(path.join(testRoot, "files")).forEach((i) => {
  const directoryName = path.join(testRoot, "files", i);
  if (fs.lstatSync(directoryName).isDirectory()) {
    if (!fs.existsSync(path.join(directoryName, "input.ts"))) {
      return;
    }
    if (!fs.existsSync(path.join(directoryName, "options.json"))) {
      return;
    }
    testDirectories.push(directoryName);
  }
});

const promises = Promise.all(
  testDirectories.map(async (testDir) => {
    console.log("Running test " + path.basename(testDir));
    const input = fs.readFileSync(path.join(testDir, "input.ts"), {
      encoding: "utf-8",
    });
    const options = JSON.parse(
      fs.readFileSync(path.join(testDir, "options.json")).toString(),
    );
    return Promise.all(
      options.map(async (option: any) => {
        if (!option.filename) {
          throw TypeError("Option does not have filename property");
        }
        if (!option.options) {
          throw TypeError("Option does not have option property");
        }

        const outputPath = path.join(testDir, option.filename);
        if (!fs.existsSync(outputPath)) {
          throw Error("Option output path " + outputPath + " does not exist");
        }
        const expectedResult = fs
          .readFileSync(outputPath, { encoding: "utf-8" })
          .replace("\r", "");

        let result = await prettier.format(input, {
          ...prettierConfig,
          ...option.options,
        });
        result = result.replace("\r", "");

        let failAlert: string[] = [];
        if (expectedResult.length != result.length) {
          failAlert.push(
            `The expected length (${expectedResult.length}) ` +
              `does not match the result length (${result.length})`,
          );
        }
        let lineCount = 1;
        let resultLine = "";
        let expectedLine = "";
        for (let index = 0; index < expectedResult.length; index++) {
          if (expectedResult[index] === "\n") {
            lineCount += 1;
            resultLine = "";
            expectedLine = "";
          }
          expectedLine += expectedResult[index];
          resultLine += index < result.length ? result[index] : "";
          if (
            index >= result.length ||
            expectedResult[index] != result[index]
          ) {
            failAlert.push(
              `Result does not match expected output ` +
                `(Char ${index}, Line ${lineCount}, Col ${expectedLine.length})`,
            );

            let isExpected = true;
            [expectedLine, resultLine].forEach((line) => {
              failAlert.push(
                "\t" +
                  (isExpected ? "Expected" : "Result") +
                  " (Len " +
                  line.length.toString() +
                  ")" +
                  ": " +
                  line.replace(" ", "·").replace("\t", "⸻").replace("\n", "⮒"),
              );
              isExpected = !isExpected;
            });
            break;
          }
        }
        if (failAlert.length > 0) {
          failAlert.splice(
            0,
            0,
            `Test "${path.basename(testDir)}" failed on "${option.filename}":`,
          );
          const formattedAlert = failAlert.join("\n\t");
          console.error(formattedAlert);

          console.log("Expected:\n\n");
          console.log(expectedResult);
          console.log("Received:\n\n");
          console.log(result);

          exitCode += 1;
        }
      }),
    );
  }),
);

promises.then(() => {
  process.exit(exitCode);
});

export {};

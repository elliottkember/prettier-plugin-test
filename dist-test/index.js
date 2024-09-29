"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");
const prettierConfig = {
    parser: "typescript",
    plugins: ["../dist/index.js"],
};
let exitCode = 0;
const testRoot = path.resolve(__dirname);
let testDirectories = [];
fs.readdirSync(path.join(testRoot, "files")).forEach((i) => {
    const directoryName = path.join(testRoot, "files", i);
    if (fs.lstatSync(directoryName).isDirectory()) {
        if (!fs.existsSync(path.join(directoryName, "input.example"))) {
            return;
        }
        if (!fs.existsSync(path.join(directoryName, "options.json"))) {
            return;
        }
        testDirectories.push(directoryName);
    }
});
const promises = Promise.all(testDirectories.map((testDir) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running test " + path.basename(testDir));
    const input = fs.readFileSync(path.join(testDir, "input.example"), {
        encoding: "utf-8",
    });
    const options = JSON.parse(fs.readFileSync(path.join(testDir, "options.json")).toString());
    return Promise.all(options.map((option) => __awaiter(void 0, void 0, void 0, function* () {
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
        let result = yield prettier
            .format(input, Object.assign(Object.assign({}, prettierConfig), option.options));
        result = result.replace("\r", "");
        let failAlert = [];
        if (expectedResult.length != result.length) {
            failAlert.push(`The expected length (${expectedResult.length}) ` +
                `does not match the result length (${result.length})`);
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
            if (index >= result.length || expectedResult[index] != result[index]) {
                failAlert.push(`Result does not match expected output ` +
                    `(Char ${index}, Line ${lineCount}, Col ${expectedLine.length})`);
                let isExpected = true;
                [expectedLine, resultLine].forEach((line) => {
                    failAlert.push("\t" +
                        (isExpected ? "Expected" : "Result") +
                        " (Len " +
                        line.length.toString() +
                        ")" +
                        ": " +
                        line.replace(" ", "·").replace("\t", "⸻").replace("\n", "⮒"));
                    isExpected = !isExpected;
                });
                break;
            }
        }
        if (failAlert.length > 0) {
            failAlert.splice(0, 0, `Test "${path.basename(testDir)}" failed on "${option.filename}":`);
            const formattedAlert = failAlert.join("\n\t");
            console.error(formattedAlert);
            exitCode += 1;
        }
    })));
})));
promises.then(() => {
    process.exit(exitCode);
});

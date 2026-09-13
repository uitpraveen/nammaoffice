import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export default defineConfig({testDir:"./tests/browser",fullyParallel:false,workers:1,timeout:60000,expect:{timeout:15000},reporter:[["list"],["html",{open:"never"}]],use:{baseURL:"http://127.0.0.1:3012",trace:"retain-on-failure",screenshot:"only-on-failure",launchOptions:existsSync(chrome)?{executablePath:chrome}:{} }});

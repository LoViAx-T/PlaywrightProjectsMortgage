# ICA Banken Auto Tests

Repo for icabanken.se auto tests

## Pre requisties

Recommended to use gitbash on windows

-  [VS Code (not via software center)](https://code.visualstudio.com/download)
-  [Playwright extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
-  [nodejs](https://nodejs.org/en)
-  [nvm-windows](https://github.com/coreybutler/nvm-windows)

## Install

### GitBash

**Use gitbash!!!**

Download: https://www.git-scm.com/downloads

### NVM

Install nvm: https://github.com/coreybutler/nvm-windows/releases/tag/1.1.10
+ Download nvm-setup.exe
+ Follow install instructions
+ Let nvm take controll over current node version

### npm

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

*We strongly recommend using a Node version manager like nvm to install Node.js and npm*

```bash
$ nvm install `cat .nvmrc` # this installs the a version of node that works for this project, you have to stand in the root of the project for this command to work
```

(Run these commands in root of project)

Use correct node version for this project

```bash
$ nvm use `cat .nvmrc`
```

Install project dependencies (**important:** turn of VPN)

```bash
$ npm install
```

### Setting up environment

We need to add MF Username and MF Password to our windows evironment variables

To do that follow these steps:

1. Search in windows search for **edit environment variables for your account**
2. click on button **new** under User variables
3. Add variable name: MFPASS and variable value: **your AD username**
4. Add variable name: MFPASSWORD and variable value: **your MF password**

After these steps reload your environment (VSCode and your terminal).

## Known Errors and How To Fix them

If you see the error below, run `npm playwright install`.

```text
Error: browserType.connect: Executable doesn't exist at C:\Users\extyde\AppData\...\chrome.exe
```

If you see the error bellow, it means that the vpn blocked some code within the package `ibm_db` to download correctly.

**FIX:**

1. Remove node_modules from the root directory of the project
2. turn of VPN
3. run `npm install` again and everything should be installed properly.

```text
Could not locate the bindings file. Tried:
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\build\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\build\Debug\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\build\Release\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\out\Debug\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\Debug\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\out\Release\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\Release\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\build\default\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\compiled\18.17.1\win32\x64\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\addon-build\release\install-root\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\addon-build\debug\install-root\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\addon-build\default\install-root\odbc_bindings.node
 → c:\Users\username\code\ICABanken.se\node_modules\ibm_db\lib\binding\node-v108-win32-x64\odbc_bindings.node
```

## Way of Working

### Switching environments (Important)

By default all tests will run against VER environment with out any further configuration.

If you need to switch environment to test for example, we just change the environment variable `ENV_FILE`.
We can see all the available environments in the folder `.env` in the root of the project

So if we want to change environemnt to _test_ use the command bellow in your terminal (Remember to close down your VSCode window or else it wont use the new env variable)

```shell
$ export ENV_FILE=test
```

### If you need to run SQL queries

If you need to run an SQL query against a specific database, use these environment variables.

```text
DB_SQL_ABTEST=ABTEST
DB_SQL_ABVER=ABVER
DB_SQL_VICTUSTEST=ICA.Bank.Victus
DB_SQL_VICTUSVER=ICA.Bank.Victus.Ver
```

See example test case: "tests > example > sqltest.spec.ts"

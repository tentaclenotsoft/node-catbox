<p align="center">
    <img src="https://files.catbox.moe/imhw87.png"><br>
    <b>Lightweight and simple module to <a href="https://catbox.moe/" target="_blank">catbox.moe</a> api management.</b>
    <br><br>
    <a href="https://npmjs.com/package/catbox.moe"><img alt="npm" src="https://img.shields.io/npm/v/catbox.moe?style=flat-square"  alt="Version"></a>
    <img src="https://img.shields.io/bundlephobia/min/catbox.moe?style=flat-square" alt="NPM Bundle Size">
    <img src="https://img.shields.io/david/tenasatupitsyn/node-catbox?style=flat-square" alt="Dependencies">
    <a href="https://github.com/tenasatupitsyn/node-catbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tenasatupitsyn/node-catbox?style=flat-square" alt="License"></a>
</p>

## Contents

- [Installation](#installation)
- [Documentation](#documentation)

## Installation

```
npm install catbox.moe
```

## Documentation

### Constructor(userHash)

- `userHash` - A string containing hash of the user to which the operations will be made, if undefined the operations will be done as anonymous

### upload(urlOrPath)

- `urlOrPath` - A string containing url or path to the file

### delete(files)

- `files` - An array with the name of the files to be deleted from the account
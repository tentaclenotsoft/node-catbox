<p align="center">
    <img src="https://files.catbox.moe/imhw87.png"><br>
    <b>Lightweight and simple module to <a href="https://catbox.moe/">catbox.moe</a> api management</b>
    <br><br>
    <a href="https://npmjs.com/package/catbox.moe"><img src="https://img.shields.io/npm/v/catbox.moe?style=flat-square" alt="NPM Version"></a>
    <img src="https://img.shields.io/bundlephobia/min/catbox.moe?style=flat-square" alt="NPM Bundle Size">
    <img src="https://img.shields.io/david/tenasatupitsyn/node-catbox?style=flat-square" alt="Dependencies">
    <a href="https://github.com/tenasatupitsyn/node-catbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tenasatupitsyn/node-catbox?style=flat-square" alt="License"></a>
</p>

## Contents

- [Installation](#installation)
- [Documentation](#documentation)

## Installation

```js
$ npm install catbox.moe

// OR

$ yarn add catbox.moe
```

## Documentation

### Constructor(userHash)

- `userHash` - A string containing hash of the user to which the operations will be made, if undefined the operations will be done as anonymous

### upload(urlOrPath)
Upload a file via url or path to it

- `urlOrPath` - A url or path to the file

### delete(files)
Delete one or more files

- `files` - An array with the name of the files to be deleted from the account

### createAlbum(options)
Create a new album for your account or anonymously

- `options`
	- `title` - Name for the album
	- `description` - Album description
	- `files` - Name of files to add to your album

### editAlbum(options)
Edit album info

- `options`
    - `short` - Short code of album to be edited
    - `title` - New album title
    - `description` - New album description

### deleteAlbum(short)
Delete album

- `short` - Short code of album to be deleted
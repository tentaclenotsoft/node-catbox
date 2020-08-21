<p align="center">
    <img src="https://files.catbox.moe/imhw87.png"><br>
    <b>Lightweight and simple module to <a href="https://catbox.moe/">catbox.moe</a> api management</b>
    <br><br>
    <a href="https://npmjs.com/package/catbox.moe"><img src="https://img.shields.io/npm/v/catbox.moe?style=flat-square" alt="NPM Version"></a>
    <img src="https://img.shields.io/bundlephobia/min/catbox.moe?style=flat-square" alt="NPM Bundle Size">
    <img src="https://img.shields.io/david/tenasatupitsyn/node-catbox?style=flat-square" alt="Dependencies">
    <a href="https://github.com/tenasatupitsyn/node-catbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tenasatupitsyn/node-catbox?style=flat-square" alt="License"></a>
    <br>
    Using this tool, you agree to the Catbox Terms of Service/Privacy Policy available <a href="https://catbox.moe/legal.php">here</a>
</p>

## Installation

```bash
# with npm
$ npm install catbox.moe

# or with Yarn
$ yarn add catbox.moe
```

## Documentation

### Catbox([userHash])

```js
new Catbox(userHash)
```

- `userHash` - A string containing hash of the user to which the operations will be made, if undefined the operations will be done as anonymous

### Methods

#### upload(urlOrPath)
Upload files

- `urlOrPath` - A url or path to the file to upload

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> — The uploaded file url

#### delete(files)
Delete one or more files

- `files` - An array with the name or url of the files to be deleted from the account

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[void]()>

#### getAlbum(short)
Get album information

- `short` - Short code or url album to retrieve information

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> — Requested album info

#### createAlbum(options)
Create a new album for your account or anonymously

- `options` - An object containing one or more of the following properties
    - `title` - Name for the album
    - `description` - Description for the album
    - `files` - Name or url of files to add to your album if you wish to add

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> — The URL of the created album

#### editAlbum(options)
Edit album info

- `options` - An object containing the following properties
    - `short` - Short code or url of album to be edited
    - `title` - New album title
    - `description` - New album description
    - `files` - Name or url of files to add to your album

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> — The URL of the edited album

#### addFilesAlbum(options)
Add files to an album

- `options` - An object containing the following properties
    - `short` - Album short code or url where files will be added
    - `files` - An array with the name or url of the files to add to the album

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> — The URL of the album that was added to the files

#### removeFilesAlbum(options)
Remove one or more files from an album

- `options` - An object containing the following properties
    - `short` - Album code or url from where files will be removed
    - `files` - An array with the name or url of the files to be removed from the album

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> — The URL of the album from which the files were removed

#### deleteAlbum(short)
Delete album

- `short` - Short code or url of album to be deleted

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[void]()>
<p align="center">
    <img src="https://files.catbox.moe/imhw87.png"><br>
    <b>Lightweight and simple module to <a href="https://catbox.moe/" target="_blank">catbox.moe</a> api management.</b>
</p>

## Contents

- [Installation](#installation)
- [Documentation](#documentation)

## Installation

```
$ npm install catbox.moe
```

## Documentation

### Constructor(userHash)

- `userHash` - A string containing hash of the user to which the operations will be made, if undefined the operations will be done as anonymous

### upload(urlOrPath)

- `urlOrPath` - A string containing url or path to the file

### delete(files)

- `files` - An array with the name of the files to be deleted from the account
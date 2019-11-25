const { parse } = require('url');

module.exports = class Validators {
	static FilesValidator(files) {
		return Array.prototype.concat.apply([], files)
			.filter((file) => !file.includes(' '))
			.map((file) => parse(file).slashes ? parse(file).path.slice(1) : file);
	}

	static AlbumValidator(short) {
		short = parse(short).path;
		return short.slice(0, 3) === '/c/' ? short.slice(3) : short;
	}
};
module.exports = class Validators {
	static FilesValidator(files) {
		return Array.prototype.concat.apply([], files).filter((file) => !file.includes(' '));
	}
};
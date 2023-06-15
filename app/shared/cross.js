const crossify = (command = '') => {
  if (process.platform === 'win32') {
    return command.trim().replace('link-package', 'link-package-win').replace(/;/g, '').replace(/\n/g, '&&').replace(/(?<!@.*)\//g, '\\').replace(/&&\s+/g, '&&');
  }
  return command;
}

module.exports = crossify;

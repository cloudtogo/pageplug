const crossify = (command = '') => {
  if (process.platform === 'win32') {
    return command.trim().replace(/;/g, '').replace(/\n/g, '&&');
  }
  return command;
}

module.exports = crossify;

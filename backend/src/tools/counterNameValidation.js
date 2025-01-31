function counterNameValidation(id) {
  return new RegExp("^[A-Za-z0-9-]+$", "g").test(id);
}

module.exports = counterNameValidation;

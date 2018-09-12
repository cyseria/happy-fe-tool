exports.defaultRule = {
  prettier: "",
  commitizen: true,
  commitlint: false,
  changelog: true,
  codelint: {
    type: "fecs",
    hooks: "pre-commit"
  },
  test: {
    type: "jest",
    hooks: "pre-push"
  }
};

exports.types = {
  bd: {
    prettier: "",
    commitizen: true,
    commitlint: false,
    changelog: true,
    codelint: "fecs",
    test: "jest",
    hooks: {
      "pre-commit": "codelint",
      "pre-push": "test"
    }
  },
  wx: {
    prettier: "",
    commitizen: true
  },
  aaa: {
    commitizen: true
  }
};

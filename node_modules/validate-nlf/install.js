var Validate = require('git-validate');

Validate.copy('jshintrc', '.jshintrc');
Validate.installScript('lint', 'jshint .');
Validate.configureHook('pre-commit', ['lint']);

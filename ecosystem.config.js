module.exports = {
  apps: [{
    name: 'domain_info',
    script: './bin/www',
    instances: 'max',
    exec_mode: 'cluster',
  }],
};

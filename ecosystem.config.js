module.exports = {
  apps: [{
    name: 'domain_info',
    script: './bin/www',
    instances: '4',
    exec_mode: 'cluster',
  }],
};

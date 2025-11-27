module.exports = {
  apps: [{
    name: 'tennis-backend',
    script: './index.js',
    cwd: '/home/jordan/tennis_mern/server',
    interpreter: 'node',
    node_args: '-r dotenv/config',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
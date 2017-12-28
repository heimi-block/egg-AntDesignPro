/**
 * 切换API服务端接口地址
 * onrun: 线上服务端
 * local: 本地开发服务端
 */

const server = {
  local: 'http://localhost:7001/',
  onrun: 'https://egg.4-m.cn/',
}

const apiServer = server.local

export default {
  'GET /api': apiServer,
  'GET /api/*': apiServer,
  'GET /api/*/*': apiServer,
  'GET /uploads/*': apiServer,

  'POST /api': apiServer,
  'POST /api/*': apiServer,
  'POST /api/*/*': apiServer,

  'PUT /api': apiServer,
  'PUT /api/*': apiServer,
  'PUT /api/*/*': apiServer,

  'DELETE /api': apiServer,
  'DELETE /api/*': apiServer,
  'DELETE /api/*/*': apiServer,
};

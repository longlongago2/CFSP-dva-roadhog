const qs = require('qs');
const Mock = require('mockjs');

// 持久数据
let mockData = {};
if (!global.userMockData) {
  // 首次加载
  mockData = Mock.mock({
    user: {
      userid: '@natural(1,20)',
      identity: '@natural(0,2)',
      avatar: '@pick(["http://p6.sinaimg.cn/1898273997/180/88501395478963", ""])',
      description: '@csentence(5, 10)',
      personname: '@cname'
    },
  });
  global.userMockData = mockData;
} else {
  // 持久数据
  mockData = global.userMockData;
}
export default {
  // 已有接口
  'GET /users/login/:userName/:passWord': function (req, res) {
    const status = '20000'; // 状态码
    setTimeout(() => {
      if (status === '20000') {
        res.json({
          data: {
            status,
            info: {
              ...mockData.user,
              username: req.params.userName,
            },
          }
        });
      } else if (status === '20003') {
        res.json({
          data: {
            status,
            info: '用户名不存在'
          }
        });
      } else if (status === '21302') {
        res.json({
          data: {
            status,
            info: '密码错误'
          }
        });
      } else {
        res.json({
          data: {
            status,
            info: ''
          }
        });
      }
    }, 1000);
  },

  // 已有接口
  'POST /users/logout': function (req, res) {
    const status = '20097';
    setTimeout(() => {
      if (status === '20097') {
        res.json({
          data: {
            status,
            info: '用户已退出'
          }
        });
      } else if (status === '20096') {
        res.json({
          data: {
            status,
            info: '用户信息操作失败'
          }
        });
      } else {
        res.json({
          data: {
            status,
            info: ''
          }
        });
      }
    }, 500);
  },

  // 已有接口
  'PUT /users/updateUser': function (req, res) {
    const status = '21200';
    setTimeout(() => {
      if (status === '21200') {
        res.json({
          data: {
            status,
            info: '修改用户成功'
          }
        });
        global.userMockData.user.description = req.query.description;
      } else if (status === '21202') {
        res.json({
          data: {
            status,
            info: '修改用户失败'
          }
        });
      }
    }, 1000);
  },
};

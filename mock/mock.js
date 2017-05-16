/**
 * roadhog mock
 * 支持 es6 语法
 */
const qs = require('qs');
const Mock = require('mockjs');
const multiparty = require('multiparty'); // 处理表单
// 非持久数据
const RefreshData = Mock.mock({
  'subjectCollectors|1-50': [{
    collectcode: '@guid',
    collecttype: '2', // 收藏类型：专题
    'collectuserid|+1': 1,
    collectmsgcode: '@guid',
    collectmsgtitle: '@ctitle(5,50)',
    createtime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    userinfo: {
      userid: '@natural(1,20)',
      username: '@name',
      email: '@email',
      identity: '@natural(0,2)',
      avatar: '@image("100x100")',
      description: '@csentence(5, 10)',
      personname: '@cname'
    },
  }],
});
// 持久数据
let mockData = {};
if (!global.durableData) {
  // 首次加载
  mockData = Mock.mock({
    'banner|4': [
      {
        imgcode: '@guid',
        'src|+1': [
          'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
          'https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg'
        ],
        link: 'http://www.baidu.com',
        description: '@ctitle(10,20)',
      },
    ],
    'subject|10': [{
      knowledgerepositorycode: '@guid',
      imgpath: 'http://192.168.1.101/media/images/20170105/@pick(["c9e09ec1-f582-413f-94f4-6c65a5d57ea6.jpg","e0a26b5e-30c6-421b-ad29-bfa93af14375.jpg","2938ae95-9c9b-42d3-a106-cf5882c7afae.jpg","1f20acb1-84cc-4fc3-af6f-5ab48e10a1a6.jpg","dd09a994-f07b-4f4b-892c-7a3065a4d0bd.jpg","be62397f-639d-4391-9f62-c5f397497b92.jpg"])',
      knowledgerepositorytype: '1',
      'knowledgerepositoryname|+1': ['工资系列产品', '组织人事系列产品', '档案管理产品', '绩效系列产品', '警辅管理系统', '知识库管理系统', 'PAD信息管理系统', '流程管理系统', '定制系统管理', '苏州公安系统'],
      knowledgerepositorymessage: '@cparagraph',
      createtime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      bereadnum: '@natural(1,300)',
    }],
    subjectDetail: {}, // 专题详情
    'question|51': [{                  // 常见问题表和关联表（专题表，收藏表，回复表）信息
      faqcode: '@guid',
      knowledgerepositorycode: '@guid',
      faqtitle: '@ctitle(5,50)',
      faqmessage: '@cparagraph',
      createrid: '@natural(1,500)',
      createrpersonname: '@cname',
      bereadnum: '@natural(1,300)',
      createtime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      'collectinfo|11': [{             // 收藏表信息：所有
        collectcode: '@guid',
        collecttype: '1',
        'collectuserid|+1': 1,
        collectmsgcode: '@guid',
        collectmsgtitle: '@ctitle(5,50)',
        createtime: '@datetime("yyyy-MM-dd HH:mm:ss")'
      }],
      repliesnum: '@natural(1,100)',   // 回复表信息：回复条数
      knowledgerepositoryname: '@pick(["工资系列产品", "组织人事系列产品", "档案管理产品", "绩效系列产品", "警辅管理系统",""])', // 专题表信息：专题名称
    }],
    'taginfo|30': [{
      tagcode: '@guid',
      tagname: '@ctitle(2,5)',
      tagtype: '1',
      createtime: '@datetime("yyyy-MM-dd HH:mm:ss")'
    }],
  });
  global.durableData = mockData;
} else {
  // 持久数据
  mockData = global.durableData;
}

export default {
  // 已有接口：分页查询专题列表（-1查全部）
  'GET /knowledgerepository/queryKnowledgerepositoryList/:pageNumber': function (req, res) {
    const status = '22300';
    setTimeout(() => {
      if (status === '22300') {
        res.json({
          data: {
            status,
            info: mockData.subject,
          }
        });
      } else if (status === '22310') {
        res.json({
          data: {
            status,
            info: '未知错误'
          }
        });
      }
    }, 500);
  },

  // 已有接口：根据专题编号分页查询对应的常见问题列表
  'GET /knowledgerepository/queryKnowledgerepositoryfaqListByMainCodeAndPageNumAndFlag/:subjectCode/:pageNumber/:flag': function (req, res) {
    const status = '22300';
    const currentPage = parseInt(req.params.pageNumber, 0);
    const pageSize = 10; // 单页数据条数
    setTimeout(() => {
      if (status === '22300') {
        res.json({
          data: {
            status,
            info: mockData.question.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
            count: mockData.question.length, // 数据总条数
          }
        });
      } else if (status === '22310') {
        res.json({
          data: {
            status,
            info: '未知错误'
          }
        });
      }
      mockData.question = global.durableData.question;
    }, 500);
  },

  // 已有接口：根据专题编号查询单条专题详情信息
  'GET /knowledgerepository/queryKnowledgerepositoryByKPCode/:subjectCode': function (req, res) {
    const status = '22300';
    setTimeout(() => {
      const queryDataList = mockData.subject.filter(
        item => item.knowledgerepositorycode === req.params.subjectCode
      );
      if (queryDataList.length > 0) {
        mockData.subjectDetail = queryDataList[0];
        mockData.subjectDetail.collectinfo = RefreshData.subjectCollectors;
      }
      if (status === '22300') {
        res.json({
          data: {
            status,
            info: mockData.subjectDetail,
          }
        });
      } else if (status === '22310') {
        res.json({
          data: {
            status,
            info: '未知错误'
          }
        });
      }
    }, 500);
  },

  // 已有接口：分页查询常见问题列表（-1查全部）
  'GET /knowledgerepository/queryKnowledgerepositoryfaqListByFlag/:pageNumber/:flag': function (req, res) {
    const status = '22300';
    const currentPage = parseInt(req.params.pageNumber, 0);
    const pageSize = 10; // 单页数据条数
    setTimeout(() => {
      if (status === '22300') {
        res.json({
          data: {
            status,
            // info: [],
            // count: 0
            info: mockData.question.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
            count: mockData.question.length, // 数据总条数
          }
        });
      } else if (status === '22310') {
        res.json({
          data: {
            status,
            info: '未知错误'
          }
        });
      }
      mockData.question = global.durableData.question;
    }, 1000);
  },

  // 缺少接口
  'GET /menus/queryBannerImg': function (req, res) {
    const status = '20000';
    setTimeout(() => {
      if (status === '20000') {
        res.json({
          data: {
            status,
            info: mockData.banner,
          }
        });
      } else {
        res.json({
          data: {
            status,
            info: '获取信息失败'
          }
        });
      }
    }, 500);
  },

  // 已有接口：查询所有标签信息
  'GET /tag/queryTagAll': function (req, res) {
    const status = '22800';
    setTimeout(() => {
      if (status === '22800') {
        res.json({
          data: {
            status,
            info: mockData.taginfo,
          }
        });
      } else if (status === '22810') {
        res.json({
          data: {
            status,
            info: '获取信息失败',
          }
        });
      }
    }, 500);
  },

  // 已有接口：添加收藏信息
  'POST /collect/insertCollectByJson': function (req, res) {
    const status = '23000';
    const reqBody = JSON.parse(req.body);
    setTimeout(() => {
      if (status === '23000') {
        res.json({
          data: {
            status,
            info: {
              collectcode: Mock.mock('@guid'),
              collecttype: reqBody.collecttype,
              collectuserid: reqBody.collectuserid,
              collectmsgcode: reqBody.collectmsgcode,
              collectmsgtitle: reqBody.collectmsgtitle,
              createtime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
            },
          }
        });
      } else if (status === '23010') {
        res.json({
          data: {
            status,
            info: '收藏失败',
          }
        });
      }
    }, 500);
  },

  // 缺少接口：删除收藏信息
  'DELETE /collect/cleanCollectByUserIdAndCollectMsgCode/:collectUserId/:collectMsgCode': function (req, res) {
    const status = '23000';
    setTimeout(() => {
      if (status === '23000') {
        res.json({
          data: {
            status,
            info: '取消收藏成功'
          }
        });
      } else if (status === '23010') {
        res.json({
          data: {
            status,
            info: '取消收藏失败'
          }
        });
      }
    }, 500);
  },

  // 缺少接口：查询收藏者信息（根据被收藏的信息的code和收藏种类type）
  'GET /collect/queryCollectByCollectMsgCodeAndCollectType/:collectMsgCode/:collectType/:pageNumber': function (req, res) {
    const status = '23000';
    const pageSize = 10;
    const currentPage = parseInt(req.params.pageNumber, 0);
    setTimeout(() => {
      res.json({
        data: {
          status,
          info: mockData.subjectDetail.collectinfo
            .slice(currentPage * pageSize, (currentPage + 1) * pageSize),
          count: mockData.subjectDetail.collectinfo.length
        }
      });
    }, 1000);
  },

  'POST /uploadByPC': function (req, res) {
    setTimeout(() => {
      res.json({
        data: {
          status: 20000,
          info: {
            url: 'http://cfsp/media/file/req.jpg',
            size: '14.03M'
          }
        }
      });
    }, 5000);
  }

};

import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute } from 'dva/router';
import MainContainer from './routes/MainContainer/MainContainer';
import IndexPage from './routes/IndexPage/IndexPage';
import SubjectPage from './routes/SubjectPage/Index';
import QuestionList from './routes/SubjectPage/QuestionList';
import CollectList from './routes/SubjectPage/CollectionList';
import Information from './routes/SubjectPage/Information';
import RecommendationPage from './routes/RecommendationPage/Recommendation';
import QuestionSubmitPage from './routes/QuestionSubmitPage/Index';
import QuestionSubmit from './routes/QuestionSubmitPage/QuestionSubmit';
import WorkOrderSubmit from './routes/QuestionSubmitPage/WorkOrderSubmit';

const RouterConfig = ({ history }) =>
  <Router history={history}>
    <Route path="/" component={MainContainer}>
      <IndexRoute component={IndexPage} />
      <Route path="home" component={IndexPage} />
      <Route path="subject/:subjectCode" component={SubjectPage}>
        <IndexRoute component={QuestionList} />
        <Route path="questions" component={QuestionList} />
        <Route path="stars" component={CollectList} />
        <Route path="eyes" component={Information} />
      </Route>
      <Route path="ask/:askType" component={RecommendationPage} />
      <Route path="questionSubmit" component={QuestionSubmitPage}>
        <IndexRoute component={QuestionSubmit} />
        <Route path="question" component={QuestionSubmit} />
        <Route path="workOrder" component={WorkOrderSubmit} />
      </Route>
    </Route>
  </Router>;

RouterConfig.propTypes = {
  history: PropTypes.object,
};

export default RouterConfig;

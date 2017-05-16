import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Submit from '../../components/WorkOrderSubmit';

const WorkOrderSubmit = ({ subject }) =>
  <div>
    <Submit />
  </div>;

WorkOrderSubmit.propTypes = {
  subject: PropTypes.array,
};
function mapStateToProps(state) {
  return {
    ...state.present.Subject,
  };
}
export default connect(mapStateToProps)(WorkOrderSubmit);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Collections from '../../components/CollectionList';

const CollectionList = ({ dispatch, params, collection, collectionCurrentPage, loading }) => {
  function handleLoadingMore() {
    dispatch({
      type: 'Collection/pageDemanding',
      payload: {
        pageNumber: collectionCurrentPage + 1,
        collectMsgCode: params.subjectCode,
      }
    });
  }

  const collectProps = {
    collect: collection,
    loading: loading.models.Collection,
    onLoadingMore: handleLoadingMore,
  };
  return (
    <Collections {...collectProps} />
  );
};

CollectionList.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  collection: PropTypes.array,
  collectionCurrentPage: PropTypes.number,
  loading: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    ...state.present.Collection,
    loading: state.present.loading,
  };
}

export default connect(mapStateToProps)(CollectionList);

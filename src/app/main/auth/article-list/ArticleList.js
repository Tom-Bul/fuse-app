import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import React from 'react';
import reducer from 'app/auth/store';
import ArticleListHeader from './ArticleListHeader';
import ArticleListTable from './ArticleListTable';

function ArticleList() {

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<ArticleListHeader />}
			content={<ArticleListTable />}
			innerScroll
		/>
	);
}

export default withReducer('auth', reducer)(ArticleList);

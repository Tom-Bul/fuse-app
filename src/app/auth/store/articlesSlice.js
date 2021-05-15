import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getArticles = createAsyncThunk('auth/articles/getArticles', async user => {
	const response = await axios.get(`http://gn-test.crem.pl/get/articles/${user.data.displayName}`);
	const data = await response.data;

	return data;
});

export const removeArticles = createAsyncThunk('auth/articles/removeArticles', async data => {
	console.log(data)
		await axios.delete(`http://gn-test.crem.pl/get/articles/${data.id}/${data.userName}`);

		return data.id;
	}
);

const articlesAdapter = createEntityAdapter({});

export const { selectAll: selectArticles, selectById: selectArticleById } = articlesAdapter.getSelectors(
	state => state.auth.articles
);

const articlesSlice = createSlice({
	name: 'auth/articles',
	initialState: articlesAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setArticlesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getArticles.fulfilled]: articlesAdapter.setAll,
		[removeArticles.fulfilled]: (state, action) => articlesAdapter.removeMany(state, action.payload)
	}
});

export const { setArticlesSearchText } = articlesSlice.actions;

export default articlesSlice.reducer;
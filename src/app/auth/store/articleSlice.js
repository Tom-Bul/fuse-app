import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getArticle = createAsyncThunk('auth/article/getArticle', async (articleData) => {
	const response = await axios.get(`http://gn-test.crem.pl/get/articles/${articleData.articleId}/${articleData.displayName}`);
	const data = await response.data;

	return data === undefined ? null : data;
});

export const saveArticle = createAsyncThunk('auth/article/saveArticle', async article => {
	const newArticle = {
		...article,
		gross_price: article.net_price*(1+article.vat_rate/100)
	}
	const response = await axios.post('http://gn-test.crem.pl/get/articles/new', newArticle);
	const data = await response.data;

	return data;
});

export const editArticle = createAsyncThunk('auth/article/editArticle', async editedArticleData => {
	const response = await axios.put(`http://gn-test.crem.pl/get/articles/${editedArticleData.articleId}`, editedArticleData.editArticle);
	const data = await response.data;

	return data;
});

export const removeArticle = createAsyncThunk('auth/article/removeArticle', async data => {
		await axios.delete(`http://gn-test.crem.pl/get/articles/${data.id}/${data.userName}`);

		console.log('test')

		return data;
	}
);

const articleSlice = createSlice({
	name: 'auth/article',
	initialState: null,
	reducers: {
		resetArticle: () => null,
		newArticle: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: 0,
					ean: '',
					name: '',
					description: '',
					url: '',
					net_price: 0,
					vat_rate: '',
					gross_price: 0,
					stock: 0,
					added_by: ''
				}
			})
		}
	},
	extraReducers: {
		[getArticle.fulfilled]: (state, action) => action.payload,
		[saveArticle.fulfilled]: (state, action) => action.payload
	}
});

export const { newArticle, resetArticle } = articleSlice.actions;

export default articleSlice.reducer;

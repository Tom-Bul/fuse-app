import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm, useDeepCompareEffect } from '@fuse/hooks';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import { orange } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Grid, Divider, Card, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import history from '@history';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetArticle, saveArticle, newArticle, getArticle, editArticle, removeArticle} from 'app/auth/store/articleSlice';

import reducer from 'app/auth/store';

const useStyles = makeStyles(theme => ({
	articleImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	articleImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	articleImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	},
	topContainer: {
		padding: theme.spacing(3),
	},
	bottomContainer: {
		padding: theme.spacing(3),
	},
	divider: {
		backgroundColor: theme.palette.primary.dark,
	},
	cardTop: {
		backgroundColor: theme.palette.background.default,
		marginBottom: theme.spacing(3),
		padding: theme.spacing(1),
		borderColor: theme.palette.primary.dark,
	},
	cardBottom: {
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(1),
		borderColor: theme.palette.primary.dark,
	},
}));

function ArticleItem() {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);
	const article = useSelector(({ auth }) => auth.article);
	const theme = useTheme();

	const classes = useStyles();
	const [noArticle, setNoArticle] = useState(false);
	const [loading, setLoading] = useState(true);
	const { form, handleChange, setForm, setInForm, getForm } = useForm(article);
	const routeParams = useParams();
	const [vatRate, setVatRate] = useState('');
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [url, setUrl] = useState('');
	const [edit ,setEdit] = useState(false);

	useDeepCompareEffect(() => {
		function updateArticleState() {
			const { articleId } = routeParams;
			const data = {
				articleId,
				displayName: user.data.displayName
			}

			if (articleId === 'new') {
				dispatch(newArticle());
				setLoading(false)
			} else {
				dispatch(getArticle(data)).then(action => {
					setLoading(false)
					if (!action.payload) {
						setNoArticle(true);
					}
				});
			}
		}

		updateArticleState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if ((article && !form) || (article && form && article.id !== form.id)) {
			setForm(article);
		}
	}, [form, article, setForm]);

	useEffect(() => {
		return () => {
			dispatch(resetArticle());
			setNoArticle(false);
		};
	}, [dispatch]);

	useEffect(() => {
		const formInfo = getForm()
		if(formInfo && formInfo.vat_rate && formInfo.vat_rate.target && formInfo.vat_rate.target.value)
			setVatRate(formInfo.vat_rate.target.value)
	}, [form, getForm]);

	const handleSave = () => {
		const newForm = {
			...form,
			vat_rate: article.vat_rate ? article.vat_rate : vatRate,
			added_by: user.data.displayName
		}
		if(edit){
			const editedArticleData = {
				articleId: article.id,
				editArticle: newForm
			}
			dispatch(editArticle(editedArticleData))
			history.push({
				pathname: '/auth/article-list'
			});
		} else {
			dispatch(saveArticle(newForm))
		}
	}

	function handleOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}
	
	const handleCloseUpload = () => {
		setForm(
			_.set({ ...form }, `url`, url)
		);
		setOpen(false);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	}

	const handleClickOpenDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDeleteAgree = () => {
		const bannedIds = [3,6,7,8];
		const filtered = bannedIds.filter(id => id !== article.id)
		if(filtered){
			const data = {
				id: article.id,
				userName: user.data.displayName
			}
			history.push({
				pathname: '/auth/article-list'
			});
			dispatch(removeArticle(data));
		}
		setOpenDelete(false);
	};

	const handleUrlChange = (event) => {
		setUrl(event.target.value)
	}

	const handleEdit = () => {
		setEdit(true)
	}

	function canBeSubmitted() {
		return form.name.length > 0 && !_.isEqual(article, form);
	}

	if (noArticle) {
		return (
			<FuseAnimate delay={100}>
				<div className="flex flex-col flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5">
						There is no such product!
					</Typography>
					<Button
						className="mt-24"
						component={Link}
						variant="outlined"
						to="/auth/article-list"
						color="inherit"
					>
						Go to Products Page
					</Button>
				</div>
			</FuseAnimate>
		);
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/auth/article-list"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Articles</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Product'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Article Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<Grid container spacing={2} justify="flex-end">
							{(routeParams.articleId !== 'new') && 
							<Grid item>
								{!edit && 
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Button
										className="whitespace-nowrap"
										variant="contained"
										color="secondary"
										onClick={handleClickOpenDelete}
									>
										Delete
									</Button>
								</FuseAnimate>
								}
							</Grid>
							}
							{(routeParams.articleId === 'new' || edit) ? 
							<Grid item>
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Button
										className="whitespace-nowrap"
										variant="contained"
										color="secondary"
										disabled={!canBeSubmitted()}
										onClick={handleSave}
									>
										Save
									</Button>
								</FuseAnimate>
							</Grid>
							:
							(!edit &&
							<Grid item>
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Button
										className="whitespace-nowrap"
										variant="contained"
										color="secondary"
										onClick={handleEdit}
									>
										Edit
									</Button>
								</FuseAnimate>
							</Grid>
							)
							}
							
						</Grid>
						<Dialog
							open={openDelete}
							onClose={handleCloseDelete}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">{"You are about to delete an article."}</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									Are you sure?
								</DialogContentText>
							</DialogContent>
								<DialogActions>
								<Button onClick={handleCloseDelete}>
									No
								</Button>
								<Button onClick={handleCloseDeleteAgree} autoFocus>
									Yes
								</Button>
							</DialogActions>
						</Dialog>
					</div>
				)
			}
			content={
					<div>
						{routeParams.articleId === 'new' || edit ? 
							(form && 
								<Grid container direction='column' alignItems='center' justify='flex-start' style={{height: '100%'}}>
									<Grid item className={classes.topContainer} container direction='row' justify='space-around'>
										<Grid item container xs={4} justify='center'>
											<Button onClick={handleOpen}>
												<label
													htmlFor="button-file"
													className={clsx(
														classes.productImageUpload,
														'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg'
													)}
												>
													<Icon fontSize="large" color="action">
														cloud_upload
													</Icon>
												</label>
											</Button>
										</Grid>
										<Divider className={classes.divider} orientation='vertical'/>
										<Grid item xs={7}>
											<TextField
												className="mt-8 mb-16"
												// error={form.ean && form.ean === ''}
												required
												label="Ean"
												id="ean"
												name="ean"
												type="text"
												inputProps={{
													maxLength: 13
												  }}
												value={form.ean}
												onChange={handleChange}
												variant="outlined"
												fullWidth
											/>
											<TextField
												className="mt-8 mb-16"
												// error={form.name === ''}
												required
												label="Name"
												id="name"
												name="name"
												type="text"
												inputProps={{
													maxLength: 32
												  }}
												value={form.name}
												onChange={handleChange}
												variant="outlined"
												fullWidth
											/>
										</Grid>
									</Grid>
									<Grid item container direction='column' spacing={2} className={classes.bottomContainer} justify='flex-start'>
										<Grid item>
											<TextField
												className="mt-8 mb-16"
												id="description"
												name="description"
												onChange={handleChange}
												label="Description"
												type="text"
												inputProps={{
													maxLength: 512
												  }}
												value={form.description}
												multiline
												rows={5}
												variant="outlined"
												fullWidth
											/>
										</Grid>
										<Grid item container spacing={2}>
											<Grid item xs>
												<TextField
													className="mt-8 mb-16"
													// error={form.net_price === ''}
													required
													label="Net price"
													id="net_price"
													name="net_price"
													type="number"
													value={form.net_price}
													onChange={handleChange}
													variant="outlined"
													fullWidth
												/>
											</Grid>
											<Grid item xs>
												<FormControl variant="outlined" className="mt-8 mb-16" style={{width: '100%'}}>
													<InputLabel id="vat_rate_input">Vat rate</InputLabel>
													<Select
														labelId="vat_rate"
														id="vat_rate"
														value={vatRate ? vatRate : article.vat_rate}
														onChange={value => setInForm("vat_rate", value)}
														label="Vat rate"
													>
														<MenuItem value={7}>7</MenuItem>
														<MenuItem value={19}>19</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs>
												<TextField
													className="mt-8 mb-16"
													// error={form.stock === ''}
													required
													label="Stock"
													id="stock"
													name="stock"
													type="number"
													value={form.stock}
													onChange={handleChange}
													variant="outlined"
													fullWidth
												/>
											</Grid>
										</Grid>
									</Grid>
									<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
										<DialogTitle id="form-dialog-title">Upload an image by pasting it's URL below.</DialogTitle>
										<DialogContent>
											<TextField
												autoFocus
												margin="dense"
												id="url"
												label="URL"
												type="url"
												value={url}
												onChange={handleUrlChange}
												fullWidth
											/>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClose} color="primary">
												Cancel
											</Button>
											<Button onClick={handleCloseUpload} color="primary">
												Upload
											</Button>
										</DialogActions>
									</Dialog>
								</Grid>
							)
							: 
							<Grid container direction='column' alignItems='center' justify='flex-start' style={{height: '100%'}}>
								<Grid item className={classes.topContainer} container direction='row' justify='space-around'>
									<Grid item container xs={4} justify='center'>
										<img
											className="h-200 rounded"
											src={article.url}
											alt="urlImage"
										/>
									</Grid>
									<Divider className={classes.divider} orientation='vertical'/>
									<Grid item xs={7}>
										<Card className={classes.cardTop} variant='outlined'>
											<Typography variant='subtitle2'>
												<b>Id:</b> {article.id}
											</Typography>
										</Card>
										<Card className={classes.cardTop} variant='outlined'>
											<Typography variant='subtitle2'>
												<b>Ean:</b> {article.ean}
											</Typography>
										</Card>
										<Card className={classes.cardTop} variant='outlined'>
											<Typography variant='subtitle2'>
												<b>Name:</b> {article.name}
											</Typography>
										</Card>
									</Grid>
								</Grid>
								<Grid item container direction='column' spacing={2} className={classes.bottomContainer} justify='flex-start'>
									<Grid item>
										<Card className={classes.cardBottom} variant='outlined'>
											<Typography variant='subtitle2'>
												<b>Description:</b> {article.description}
											</Typography>
										</Card>
									</Grid>
									<Grid item container spacing={2}>
										<Grid item xs>
											<Card className={classes.cardBottom} variant='outlined'>
												<Typography variant='subtitle2'>
													<b>Net price:</b> {article.net_price}
												</Typography>
											</Card>
										</Grid>
										<Grid item xs>
											<Card className={classes.cardBottom} variant='outlined'>
												<Typography variant='subtitle2'>
													<b>Vat rate:</b> {article.vat_rate}
												</Typography>
											</Card>
										</Grid>
										<Grid item xs>
											<Card className={classes.cardBottom} variant='outlined'>
												<Typography variant='subtitle2'>
													<b>Gross price:</b> {article.gross_price}
												</Typography>
											</Card>
										</Grid>
										<Grid item xs>
											<Card className={classes.cardBottom} variant='outlined'>
												<Typography variant='subtitle2'>
													<b>Stock:</b> {article.stock}
												</Typography>
											</Card>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						}
					</div>
			}
			innerScroll
		/>
	);
}

export default withReducer('auth', reducer)(ArticleItem);

import { makeStyles, Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStatus } from 'app/auth/store/serverStatusSlice'
import { darken } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	container: {
		height: '100%',
		width: '100%',
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
	topContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	bottomContainer: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	textContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: theme.spacing(25),
	},
	marginRightText: {
		marginRight: theme.spacing(2)
	},
	marginText: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2)
	},
}));


function MainPage() {
	const classes = useStyles();

	const dispatch = useDispatch()
	const serverStatus = useSelector(({ auth }) => auth.serverStatus);

	const normalise = value => (value - 0.2) * 100 / (250 - 0.2);

	useEffect(() => {
		const interval = setInterval(() => dispatch(getStatus()), 3000);

		return () => clearInterval(interval)
	}, [dispatch])

	return (
		<Box className={classes.container}>
			<Box className={classes.topContainer}>
				<h1 className={classes.marginRightText}>
					CPU Usage:
				</h1>
				<Box position="relative" display="inline-flex">
					<CircularProgress size={100} variant="determinate" value={serverStatus.usage} color='secondary' />
					<Box
						top={0}
						left={0}
						bottom={0}
						right={0}
						position="absolute"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<Typography variant="h5" component="div" color="secondary">{`${Math.round(
						serverStatus.usage
						)}%`}</Typography>
					</Box>
				</Box>
				<h1 className={classes.marginText}>
					Bandwidth:
				</h1>
				<Box position="relative" display="inline-flex">
					<CircularProgress size={100} variant="determinate" value={normalise(serverStatus.bandwidth)} color='secondary' />
					<Box
						top={0}
						left={0}
						bottom={0}
						right={0}
						position="absolute"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<Typography variant="subtitle1" component="div" color="secondary">{serverStatus.bandwidth} Mb</Typography>
					</Box>
				</Box>
			</Box>
			<Box className={classes.bottomContainer}>
				<Box className={classes.textContainer}>
					<h1 className={classes.marginRightText}>Users:</h1>
					<Typography variant="h5" color="secondary">
						{serverStatus.users}
					</Typography>
				</Box>
				<Box className={classes.textContainer}>
					<h1 className={classes.marginRightText}>Calls:</h1>
					<Typography variant="h5" color="secondary">
						{serverStatus.calls}
					</Typography>
				</Box>
				<Box className={classes.textContainer}>
					<h1 className={classes.marginRightText}>Orders:</h1>
					<Typography variant="h5" color="secondary">
						{serverStatus.orders}
					</Typography>
				</Box>
			</Box>
		</Box>

	);
}

export default MainPage;

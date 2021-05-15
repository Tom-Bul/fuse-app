import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getStatus = createAsyncThunk('auth/serverStatus/getStatus', async () => {
    const response = await axios.get(`http://gn-test.crem.pl/status`);

    const data = await response.data;

    return data.status ? {
        usage: data.status.usage,
        bandwidth: Math.round(data.status.bandwidth / 10)/100,
        users: data.status.users,
        calls: data.status.calls,
        orders: data.status.orders
    } : null;
});

const serverStatusSlice = createSlice({
    name: "auth/serverStatus",
    initialState: { usage: 0, bandwidth: 0, users: 0, calls: 0, orders: 0 },
    reducers: {},
    extraReducers: {
        [getStatus.fulfilled]: (state, action) => action.payload
    }
})

export const { setStatus } = serverStatusSlice.actions;

export default serverStatusSlice.reducer;
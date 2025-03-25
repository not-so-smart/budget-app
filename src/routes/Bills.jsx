import React from 'react';
import Box from '@mui/material/Box';
import { useParams } from 'react-router';

export default function Bills() {
    // Feel free to ignore this, it's just an example of how to use the 
    // useParams hook in case we need to implement deep linking in the future
    const { id } = useParams();

    return (
        <Box>
            <h1>Bills</h1>
            <p>This is the Bills page for bill ID: {id}</p>
        </Box>
    );
};
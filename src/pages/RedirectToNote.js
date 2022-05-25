import React from 'react'
import { Navigate, useParams } from 'react-router-dom';

function RedirectToNote() {
    const { note } = useParams();
    return <Navigate to={`/n/${note}`} />;
}

export default RedirectToNote;

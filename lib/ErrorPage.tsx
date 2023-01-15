import * as React from "react";
import {useRouteError} from "react-router-dom";

export function ErrorPage(){
    const error = useRouteError() as any
    return <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
        <h2>Error</h2>
        <div>{error?.statusText}</div>
    </div>;
}
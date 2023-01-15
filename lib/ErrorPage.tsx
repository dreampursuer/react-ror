import * as React from "react";

export type ErrorPageType = (msg: string) => JSX.Element
export interface ErrorPageProps {
    msg: string
}
export function ErrorPage({msg}: ErrorPageProps){
    return <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
        <h2>Error</h2>
        <div>{msg}</div>
    </div>;
}
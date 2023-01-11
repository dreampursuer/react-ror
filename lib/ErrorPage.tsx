import * as React from "react";

export type ErrorPageType = (msg: string) => JSX.Element
export interface ErrorPageProps {
    msg: string
}
export function ErrorPage({msg}: ErrorPageProps){
    return <div>{msg}</div>;
}
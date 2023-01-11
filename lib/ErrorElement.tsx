import * as React from "react";

export type ErrorElementType = (msg: string) => JSX.Element
export interface ErrorElementProps{
    msg: string
}
export function ErrorElement({msg}: ErrorElementProps){
    return <div>{msg}</div>;
}
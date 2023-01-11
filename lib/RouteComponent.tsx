import {useParams} from "react-router-dom";
import {ControllerMappingType} from "./UrlMappings";
import {ErrorElement, ErrorElementType} from "./ErrorElement";
import * as React from "react";


function isInstanced(obj: any) {
    const type: string = typeof obj
    if (type === "object"){
        return true;
    }
    return false;
}

interface RouteComponentProps {
    controllerMapping: ControllerMappingType
    onError?: ErrorElementType
}

export function RouteComponent({controllerMapping, onError}: RouteComponentProps) {
    const params = useParams();
    let controllerName = params.controller;
    if (!controllerName){
        controllerName = "main";
    }
    let actionName = params.action;
    if (!actionName){
        actionName = "index";
    }

    let controller = controllerMapping[controllerName];
    if (!controller){
        const msg = "Not found controller:" + controllerName + " in controllerMapping!"
        if (onError){
            return onError(msg)
        }
        return <ErrorElement msg={msg} />
    }
    if (!isInstanced(controller)){
        controller = Reflect.construct(controller, [])
        controllerMapping[controllerName as string] = controller
    }

    const action = controller[actionName];
    if (!action){
        const msg = "Not found action:" + actionName + " in " + controllerName + " controller!"
        if (onError){
            return onError(msg)
        }
        return <ErrorElement msg={msg}/>
    }
    return action();
}
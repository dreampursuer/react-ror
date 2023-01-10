import {useParams} from "react-router-dom";
import {urlMapping} from "./conf/UrlMapping";

function isInstanced(obj: any) {
    const type: string = typeof obj
    if (type === "object"){
        return true;
    }
    return false;
}

export function RouteComponent() {
    const params = useParams();
    let controllerName = params.controller;
    if (!controllerName){
        controllerName = "main";
    }
    let actionName = params.action;
    if (!actionName){
        actionName = "index";
    }
    let controller = urlMapping[controllerName];
    if (!isInstanced(controller)){
        controller = Reflect.construct(controller, [])
        urlMapping[controllerName] = controller
    }
    const result = controller[actionName]();

    return result;
}
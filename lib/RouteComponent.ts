import {useParams} from "react-router-dom";
import {ControllerMappingType} from "./UrlMappings";

function isInstanced(obj: any) {
    const type: string = typeof obj
    if (type === "object"){
        return true;
    }
    return false;
}

interface RouteComponentProps {
    controllerMapping: ControllerMappingType
}

export function RouteComponent({controllerMapping}: RouteComponentProps) {
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
    if (!isInstanced(controller)){
        controller = Reflect.construct(controller, [])
        controllerMapping[controllerName] = controller
    }
    const result = controller[actionName]();

    return result;
}
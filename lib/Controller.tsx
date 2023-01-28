import {useParams, useSearchParams} from "react-router-dom";
import {ControllerMappingType, AccessCheckType} from "./ReactRorApp";
import * as React from "react";
import {ParamsType} from "./utils";


function isInstanced(obj: any) {
    const type: string = typeof obj
    if (type === "object"){
        return true;
    }
    return false;
}

interface ControllerProps {
    controllerMapping: ControllerMappingType
    accessCheck?: AccessCheckType
    skipAccessCheck?: string[]
}

const instanceMap = new Map()
export function Controller({controllerMapping, accessCheck, skipAccessCheck}: ControllerProps) {
    const rawParams = useParams();
    let params: ParamsType = {};
    for (let rawParamsKey in rawParams) {
        params[rawParamsKey] = rawParams[rawParamsKey]
    }
    const [searchParams] = useSearchParams();
    params.controller = params.controller || "main";
    params.action = params.action || "index";
    const controllerName = params.controller
    const  actionName = params.action

    const controller = controllerMapping[controllerName];
    if (!controller){
        const msg = "Not found controller:" + controllerName + " in controllerMapping!"
        throw new Response(msg, { status: 404, statusText:msg });
    }
    let controllerInstance = controller

    if (!isInstanced(controllerInstance)){
        controllerInstance = instanceMap.get(controllerName)
        if (!controllerInstance){
            controllerInstance = Reflect.construct(controller, [])
            instanceMap.set(controllerName, controllerInstance)
        }
    }

    const action = controllerInstance[actionName];
    if (!action){
        const msg = "Not found action:" + actionName + " in " + controllerName + " controller!"
        throw new Response(msg, { status: 404, statusText:msg });
    }

    searchParams.forEach((value, key) => {
        if(params[key]){
            if(!Array.isArray(params[key])){
                params[key] = [params[key]]
            }
            params[key].push(value)
        }else {
            params[key] = value
        }
    });

    if (accessCheck){
        if (skipAccessCheck && !canAccess(skipAccessCheck, controllerName, actionName)){
            if (!accessCheck(params)){
                return <></>
            }
        }
    }

    return action(params);
}

/**
 * Whether the target object can be accessed
 * @param skipAccessCheck
 * @param controller
 * @param action
 */
function canAccess(skipAccessCheck: string[], controller: string, action: string): boolean {
    return skipAccessCheck.includes("/" + controller + "/" + action)
}

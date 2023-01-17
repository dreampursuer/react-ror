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
}

const instanceMap = new Map()
export function Controller({controllerMapping, accessCheck}: ControllerProps) {
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
        if (!canAccess(controller.prototype, actionName)){
            if (!accessCheck(params)){
                return <></>
            }
        }
    }

    return action(params);
}

/**
 * By default, all action access requires login privileges
 * If you want to access certain actions without logging in,
 * you can use the @skipAccessCheck annotation in the action method
 * @param target
 * @param name
 * @param descriptor
 * @returns {any}
 */
export function skipAccessCheck(target:any, name:any, descriptor:any){
    let actions = target.skipAccessChecks
    if (!actions){
        actions = new Set()
        target.skipAccessChecks = actions
    }
    actions.add(name)
    return descriptor;
}

/**
 * Whether the target object can be accessed
 * @param controller controller class
 * @param {string} action 操作名
 * @returns {boolean}
 */
function canAccess(controller: any, action: string): boolean {
    let actions = controller.skipAccessChecks
    if (actions && actions.has(action)){
        return true
    }

    return false
}

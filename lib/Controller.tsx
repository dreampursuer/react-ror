import {useParams} from "react-router-dom";
import {ControllerMappingType, AccessCheckType} from "./ReactRorApp";
import * as React from "react";


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
    const params = useParams();
    let controllerName = params.controller;
    if (!controllerName){
        controllerName = "main";
    }
    let actionName = params.action;
    if (!actionName){
        actionName = "index";
    }

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
    if (accessCheck){
        if (!canAccess(controller.prototype, actionName)){
            if (!accessCheck({controller:controllerName, action: actionName})){
                return null
            }
        }
    }

    return action();
}

/**
 * By default, all action access requires login privileges
 * If you want to access certain actions without logging in,
 * you can use the @accessAll annotation in the action method
 * @param target
 * @param name
 * @param descriptor
 * @returns {any}
 */
export function accessAll(target:any, name:any, descriptor:any){
    let actions = target.accessAllActions
    if (!actions){
        actions = new Set()
        target.accessAllActions = actions
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
    let actions = controller.accessAllActions
    if (actions && actions.has(action)){
        return true
    }

    return false
}

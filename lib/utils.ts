/**
 * Redirect to the specified #controller/action
 * @param {string} controller
 * @param {string} action
 * @param params
 */
export function redirectTo(controller: string, action: string, params?: any){
    let url = buildUrl(controller, action, params)
    const newHref = '#' + url
    const currentHref = window.location.hash
    if (newHref === currentHref){
        // No change in address, then reload directly
        window.location.reload()
    }
    else{
        window.location.hash = newHref
    }
}

/**
 * build url by /controller/action/params
 * @param {string} controller
 * @param {string} action
 * @param params Map
 */
function buildUrl(controller: string, action: string, params?: any){
    let url = "/" + controller + "/" + action
    if (params){
        params = buildParams(params)
        if (params){
            url += "?" + params
        }
    }
    return url
}

/**
 * Converting object parameters to the parameter type in the URL
 * @param params
 * @param nameMap Map of parameter key.For example, in params there is: {details:xxx},
 * but we want to change the name of the details to jqGrid when sending to the server,
 * then just define in the nameMap: {details:'jqGrid'}, so that the parameters sent to the server
 * will be jqGrid=xxx
 */
function buildParams(params: any, nameMap?: any){
    let paramsArray = [];
    for (let key of Object.keys(params)) {
        let value = params[key];
        if (value != null){
            if (typeof value === "object"){
                value = JSON.stringify(value)
            }
            let keyMapped = null
            if (nameMap){
                keyMapped = nameMap[key]
            }
            if (keyMapped){
                key = keyMapped
            }
            paramsArray.push(key + '=' + encodeURIComponent(value));
        }
    }
    if (paramsArray.length > 0){
        return paramsArray.join('&');
    }
    return "";
}

export type ParamsType = {
    [key:string]:any
}
/**
 * let link = createLink({controller:"book", action:"list", params:{
 *     category: "science",
 *     author: "Stephen Hawking"
 * }});
 * console.log(link);
 * // Output: "#/book/list?category=science&author=Stephen%20Hawking"
 * @param controller
 * @param action
 * @param params
 */
export function createLink({controller, action, id, params}: {controller:string, action: string, id?:any, params?:ParamsType}) {
    let link = `#/${controller}/${action}`;
    if (id){
        link = link + "/" + id
    }
    let queryParams = "";
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            if (queryParams.length == 0) {
                queryParams += "?";
            } else {
                queryParams += "&";
            }
            queryParams += key + "=" + params[key];
        }
    }
    return link + queryParams;
}


/**
 * The basic URL pattern here is: /:controller?/:action?/:id?, that is, at most 3 sections in the URL, the first two sections are: controller and action, and the last section is id, while in the URL will be with the query string, the following are a few test cases.
 * /user/show => {controller:'user', action:'show'}
 * /user/show/12121 => {controller:'user', action:'show', id:12121}
 * /user/show?k1=v1&k2=v2 => {controller:'user', action:'show', params:{k1:v1, k2:v2}}
 * /user/show?k1=v11&k2=v2&k1=v12 => {controller:'user', action:'show', params:{k1:[v11, v12], k2:v2}}
 * @param url
 */
export function parseLocation(): ParamsType {
    let url = window.location.hash
    if (url.startsWith("#")){
        url = url.substring(1)
    }
    const [path, query] = url.split("?");
    const parts = path.split("/").filter(p => p !== "");
    let result:ParamsType = {};
    if (parts.length > 0) {
        result.controller = parts[0];
    }
    if (parts.length > 1) {
        result.action = parts[1];
    }
    if (parts.length > 2) {
        result.id = parts[2];
    }
    if (query) {
        const params: ParamsType = {};
        query.split("&").forEach(p => {
            const [key, value] = p.split("=");
            if(params[key]){
                if(!Array.isArray(params[key])){
                    params[key] = [params[key]]
                }
                params[key].push(value)
            }else {
                params[key] = value
            }
        });
        result.params = params;
    }
    return result;
}

type OptionsType = {
    apiRoot?: string
    method?: 'get'|'post'
    [key:string]:any
}

/**
 * Fetch data from remote service
 * Assume the remote service follows controller/action naming pattern.
 *
 * @param controller
 * @param action
 * @param params
 * @param options
 */
export async function fetchData(controller: string, action: string, params?: ParamsType|null, options?: OptionsType|null){
    let apiRoot = options?.apiRoot
    if (!apiRoot){
        apiRoot = ""
    }

    let method = options?.method
    if (!method){
        method = "get"
    }
    if (method === 'get'){
        let url = apiRoot + buildUrl(controller, action, params);
        console.debug("url:", url)
        let ret: any = await fetch(url)
        ret = await ret.json()
        return ret
    }
    else{
        const url = apiRoot + buildUrl(controller, action)
        console.debug("url:", url)
        let strParams = buildParams(params)
        let ret = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: strParams
        });
        ret = await ret.json();
        return ret
    }
}

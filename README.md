# react-ror

react-ror adopts the concept of Rails/Grails etc. based on convention over configuration and uses the concept of Controller/Domain/View to organize the application.

This schema makes a convention for the path to the URL, using the /controller/action pattern.

For example:

```
/user/login
```

Where `user` is the controller, the implementation is: `UserController`.
`login` is an action, corresponding to the login method in the UserController.
See the section on Path Mapping later for more details.

Read this in other languages: English | [简体中文](README_zh-CN.md)

## Installation

You can install this library separately using:

```shell
npm install react-ror
```

or

```shell
yarn add react-ror
```

You can also build the application quickly by creating the [react-ror template](https://github.com/dreampursuer/cra-template-react-ror) directly as follows:

```shell
npx create-react-app my-app --template react-ror
```

or

```shell
yarn create react-app my-app --template react-ror
```

Then run:

```shell
yarn start
```

It is highly recommended that users create application by `react-ror template`.

For more information on how to use the `react-ror template`, see: https://github.com/dreampursuer/cra-template-react-ror.

## Core Concept

As this library is mainly designed to match the development model of Rails/Grails/..., the directory structure is suggested based on the convention over configuration approach as follows.

```
├── App.tsx
├── components
│   ├── AvatarDropdown.tsx
│   └── SideMenu.tsx
├── conf
│   └── ApplicationConfig.ts
├── controllers
│   ├── MainController.tsx
│   └── UserController.tsx
├── domain
│   └── User.tsx
├── services
│   └── UserService.ts
└── views
    ├── layouts
    │   ├── MainLayout.tsx
    │   └── NeatLayout.tsx
    ├── main
    │   └── index.tsx
    └── user
        ├── login.tsx
        └── show.tsx
```

The structure of each directory above is described as follows:

### conf directory

The conf directory is used to define the configuration file, in this template there is 'ApplicatonConfig.ts' file defines the `controllerMapping` and `layoutMapping`.

### controllers directory

All Controller files are stored in the controllers directory, and the Controller will contain various actions.

### views directory

The pages to be displayed are saved in this directory, and the directory structure of the view file is organized according to the controller as a directory in order to be able to organize the view easily.

The `layout` directory under the views directory is used to store layout files.

### domain directory

The domain directory holds entity objects.

### services directory

Various services related to business logic are stored in this directory.

### components directory

If a component can be shared by other views, it can be stored in the components directory.

## How to use react-ror?

### ReactRorApp

It is recommended that `ReactRorApp` be called in the application entry:

```jsx
<ReactRorApp controllerMapping={controllerMapping} layoutMapping={layoutMapping} accessCheck={AccessCheck} skipAccessCheck={skipAccessCheck} />
```

controllerMapping：Defines the mapping of the controller name part of the path to the controller class, e.g.:

```typescript
export const controllerMapping = {
    main: MainController,
    user: UserController,
}
```

The above instructs that the action in MainController is called when /main is accessed in the path; the action in UserController is called when /user is accessed.

layoutMapping：Defines the mapping between the name of the layout and the layout view

accessCheck：Used for access checking. If not set then access checking is not enabled, this means that all pages can be accessed.

skipAccessCheck: used to skip the access check of some paths, for example, if you want to skip the access check of the login action, you can set in it: /user/login

### Path Mapping

The default mapping rules for paths in react-ror are as follows:

```
/:controller?/:action?/:id?
```

It is also agreed that if the controller is empty the default is `main`

If action is empty the default is `index`

The APIs related to path navigation and parameter extraction are：

- redirectTo(controller, action, params): Redirect to /controller/action with parameters

- createLink(controller, action, params): Create link. e.g.: createLink('user', 'index') => #/user/index, Preceded by # for direct use in the url.

- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)：The hook function in react-router can be used to navigate to the specified URL.

- [useParams](https://reactrouter.com/en/main/hooks/use-params)：Getting the matching parameters in the URL, contains controller,action and id

- [useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)：Get the query parameters in the URL

### Layout Management

The layout file is saved in the views/layout directory, and the part to be exported is defined using [`<Outlet />`](https://reactrouter.com/en/main/components/outlet) to define it.

The mapping for layout is defined in conf/ApplicationConfig.ts:

```javascript
export const layoutMapping = {
    '/user/login': NeatLayout,
    '*': MainLayout
}
```

### Access Check

The accessCheck function can be passed in ReactRorApp, and if a custom access check function is passed, access will be allowed or not based on the return value in this check function.

For example:

```typescript
export function AccessCheck(params?: any){
    if (!loginUser){
        redirectTo('user', 'login')
        return false
    }
    return true
}
```

You can define `skipAccessCheck` if you don't need to do access checking for the action, for example, if you don't want to do access checking on the login action, you can use the following definition:

```javascript
export const skipAccessCheck = ["/user/login"]
```

The pattern in skipAccessCheck is: /controller/action

### Fetch data from remote services

Use `fetchData` to get data from a remote server, where this remote service follows the controller/action pattern.
# react-ror

react-ror采用Rails/Grails等基于约定优于配置的理念，使用Controller/Domain/View等概念来组织应用。

本模式对URL的路径进行了约定，采用/controller/action的模式。

例如：

```
/user/login
```

其中user为controller，具体的实现为：UserController

login为action，对应到UserController中的login方法

详情请参阅后面的路径映射部分。

使用其他语言阅读：[English](README.md) | 简体中文

## 安装

你可以单独安装本库：

```shell
npm install react-ror
```

或者

```shell
yarn add react-ror
```

你也可以直接创建[react-ror template](https://github.com/dreampursuer/cra-template-react-ror)的方式来快速构建应用：

```shell
npx create-react-app my-app --template react-ror
```

或者

```shell
yarn create react-app my-app --template react-ror
```

安装完成后还需要手工修改下tsconfig.json，把`experimentalDecorators`设置为true以支持decorator:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

然后运行：

```shell
yarn start
```

强烈建议用户通过template的方式快速创建应用。

关于如何使用`react-ror template`, 参见：https://github.com/dreampursuer/cra-template-react-ror。

## 核心理念

由于本库主要为了配合Rails/Grails等应用的开发模式，基于约定优于配置的方式，相应的目录结构建议如下：

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

上面各目录结构说明如下：

### conf目录

conf目录用于定义配置文件，在本模板中有 `ApplicatonConfig.ts` 文件定义了 `controllerMapping` 和 `layoutMapping` 。

### controllers目录

所有Controller文件保存在controllers目录下。Controller中会包含各种操作(action)。

### views目录

页面上要显示的内容保存在本目录下，同时为了能够方便组织view，view文件的目录结构中又按照controller作为目录来进行组织。

views目录下的layout目录中用于存放各种布局文件。

### domain目录

domain目录下保存了各种实体对象。

### services目录

各种跟业务逻辑相关的service保存在本目录下。

### components目录

如果某个组件可以被其它view进行共用，可以把这个组件抽取出来保存在components目录下。

## 如何使用react-ror？

### ReactRorApp

建议在应用程序入口中直接调用`ReactRorApp`，调用方式如下：

```jsx
<ReactRorApp controllerMapping={controllerMapping} layoutMapping={layoutMapping} accessCheck={AccessCheck} />
```

其中：

controllerMapping：定义了controller名字同路径上controller部分的对应关系，例如：

```typescript
export const controllerMapping = {
    main: MainController,
    user: UserController,
}
```

上面就指示了当路径中访问/main时调用MainController中的action；当访问/user时就调用UserController中的action。

layoutMapping：定义了布局的名字和实际布局之间的映射关系

accessCheck：用于访问检查。如果不设置则不启用访问检查，这意味着所有的页面都能被访问。

### 路径映射

react-ror中对路径的默认映射规则如下：

```
/:controller?/:action?/:id?
```

同时约定了，如果controller为空默认为`main`

如果action为空默认为index

跟路径跳转和参数获取相关的API有：

- redirectTo(controller, action, params): 跳转到指定的controller/action下

- createLink(controller, action, params): 创建link，例如：createLink('user', 'index') => #/user/index， 前面加了#便于直接用在url中。

- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)：react-router中的hook函数，可以用于导航到指定URL中。

- [useParams](https://reactrouter.com/en/main/hooks/use-params)：获取URL中的匹配参数，主要是controller,action和id

- [useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)：获得URL中的查询参数

### 布局管理

布局文件保存在views/layout目录下，要输出的部分用react-router中的`[<Outlet />`](https://reactrouter.com/en/main/components/outlet)来定义。

layout的映射定义在conf/ApplicationConfig.ts中：

```javascript
export const layoutMapping = {
    '/user/login': NeatLayout,
    '*': MainLayout
}
```

### 访问检查

在ReactRorApp中可以传递accessCheck函数，如果传递了自定义的访问检查函数，则会根据此检查函数中返回值来确定是否允许访问。

例如：

```typescript
export function AccessCheck(params?: any){
    if (!loginUser){
        redirectTo('user', 'login')
        return false
    }
    return true
}
```

对于某action不需要进行访问权限检查的话可以使用@skipAccessCheck，例如：

```javascript
    @skipAccessCheck
    public login(){
        return <Login />
    }
```
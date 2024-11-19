
declare global {
    declare type RootState = import('../src/app/store/appStore').RootState
    declare type AppDispatch = import('../src/app/store/appStore').AppDispatch
    // declare type AppStore = import('../src/app/store/appStore').AppStore

    interface IDict<T>{
      [key:string]: T
    }

    declare type Dict<T> = IDict<T>
  }

export {}
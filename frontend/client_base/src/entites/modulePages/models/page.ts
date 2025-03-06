import { IComponents, IDialog, IMenu } from "alex-evo-web-constructor";

export interface IPage {
    page: IComponents;
    url: string;
    name: string;
}

export interface PageData {
    page: IPage
    dialogs: IDialog[]
	menu: IMenu[]
}
from moduls_src.pages import TableFields, TibleCol, ActionSchema, MenuFieldSchema, Pages, Page, TableContent, Cards, CardFields, fieldSRC

def page():
    return Pages(
        name="mqtt",
        pages=[Page(
            name="mqtt",
            menu=[
                MenuFieldSchema(
                    title=fieldSRC(
                        type="text",
                        path="update"
                    ),
                    action=[
                        ActionSchema(type="update"),
                    ]
                ),
                MenuFieldSchema(
                    title=fieldSRC(
                        type="text",
                        path="clear"
                    ),
                    action=[
                        ActionSchema(
                            address="/api/module/mqtt/clear",
                        ),
                        ActionSchema(type="update"),
                    ]
                )
            ],
            content=TableContent(
                src="/api/module/mqtt/get",
                ws_src="mqtt",
                items=TibleCol(
                    title=fieldSRC(
                        type="path",
                        path=".topic"
                    ),
                    fields=[
                    TableFields(
                        title="address",
                        value=fieldSRC(
                            type="path",
                            path=".topic"
                        )
                    ),
                    TableFields(
                        title="message",
                        value=fieldSRC(
                            type="path",
                            path=".message"
                        )
                    )]
                )
            )
        )]
    )

    # {
    # "name":"mqtt",
    # "pages":[
    #     {
    #     "name": "mqtt",
    #     "src":"/api/module/mqtt/get",
    #     "typeContent": "cards",
    #     "rootField": ".",
    #     "cards":{
    #         "fields":[
    #             {
    #                 "name":{
    #                     "type":"text",
    #                     "value":"address"
    #                 },
    #                 "value":{
    #                     "type":"path",
    #                     "value":".topic"
    #                 }
    #             },
    #             {
    #                 "name":{
    #                     "type":"text",
    #                     "value":"message"
    #                 },
    #                 "value":{
    #                     "type":"path",
    #                     "value":".message"
    #                 }
    #             }
    #         ]
    #         },
    #     "title":
    #     }
    # ]
    # }

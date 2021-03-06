import moment from 'moment';
import React from 'react';
import { ENUM_KIND_OF_SHAPE_OF_MESSAGE } from '../../../../../../../../../libraries/Enum/shape_of_message';
import './text-context-chat.scss';

function TextContextChatScreen(props : any){
    const { context , datetime , time , index } = props;

    const showContext = () =>{
        const rows = context.split("\n");
        if(rows.length > 1){
            return rows.map((row: string) =>{
                if(row){
                    return <span>
                        {row}
                        <br></br>
                    </span>;
                }
                return <></>;
            })
        }
        return <span className="body-regular">
            {context}
        </span>;
    }

    const getClassByShape = () =>{
        const shape = props.shape;

        switch (shape) {
            case ENUM_KIND_OF_SHAPE_OF_MESSAGE.TOP:
                return "";
            case ENUM_KIND_OF_SHAPE_OF_MESSAGE.CENTER:
                return "currentchat-center";
            case ENUM_KIND_OF_SHAPE_OF_MESSAGE.BOTTOM:
                return "currentchat-bottom";
        }
    }

    if(context){
        return (
            <div className={ "padding-12 " + (props.isCurrent ? "currentchat-text " : "guestchat-text ") + getClassByShape() }>
                { showContext() }    
                <span className="chat-time">
                    {/* { props.shape + " --- " + moment(time).format("YYYY-MM-DD HH:mm:ss") + " --- " + index } */}
                    { datetime }
                </span>
            </div> 
        )
    }

    return <></>;
}

export default TextContextChatScreen;
import React from 'react'
import './style.css';

/**
* @author
* @function Popup
**/

const Popup = (props) => {

    const popup_off = () => {
        props.popupOff();
    }

    const popup_func = () => {
        props.popupFunc();
        props.popupOff();
    }

    return(
        <div class="popup_wrap">
            <div class="popup_box">
                <div class="popup_content">
                    <div class="popup_text">
                        {props.popupContent}
                        </div>
                    <div class="popup_buttonDiv">
                        <button class="popup_button" id="popup_ok" onClick={popup_func}>{props.popupOk}</button>
                        <button class="popup_button" id="popup_cancel" onClick={popup_off}>{props.popupCancel}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;
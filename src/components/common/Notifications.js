import {toast} from "react-toastify";

class Notifications {
    static notify = (msg, type) => toast(msg, {autoClose: 5000, type: type, position: "top-center"});
}

export default Notifications;
/* eslint-disable jsx-a11y/anchor-is-valid */
import { ApiClient } from "../../interceptors/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
const Logout = () => {
    const nav = useNavigate();
    ApiClient().get('account/logout').then(res => {
        nav('/login')
    })
}
export default Logout;
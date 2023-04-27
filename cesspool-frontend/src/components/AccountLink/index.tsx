import { UserAsField } from "@types";
import React from "react";
import { getName } from "../../formats";
import { Link } from "react-router-dom";


const AccountLink: React.FC<UserAsField> = (props) => {
    return <Link style={{ color: "inherit" }} to={"/admin/account/" + props.pk }>{getName(props.email)}</Link>
};

export default AccountLink;
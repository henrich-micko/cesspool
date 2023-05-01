import { User, UserAsField } from "@types";
import React from "react";
import { getName } from "../../formats";
import { Link } from "react-router-dom";
import { HelpText } from "@components/Page";


const AccountLink: React.FC<UserAsField> = (props) => {
    return <Link style={{ color: "inherit" }} to={"/admin/account/" + props.pk }>{getName(props.email)}</Link>
};

export default AccountLink;


export const AccountContactLink: React.FC<UserAsField> = (props) => {
    return <HelpText>Kontaktovať na <Link style={{ color: "inherit" }} to={"mailto:" + props.email}>email</Link></HelpText>
}

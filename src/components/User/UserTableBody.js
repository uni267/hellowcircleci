import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material
import {
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import ImageEdit from "material-ui/svg-icons/image/edit";
import ImageDelete from "material-ui/svg-icons/action/delete";

const UserTableBody = ({ user, headers, handleDelete, loginUserId }) => {
  const renderGroups = (groups) => {
    return groups.map( (group, idx)  => (
      <Chip key={idx} style={{ marginRight: 10, marginTop: 5, marginBottom: 5 }}>
        {group.name}
      </Chip>
    ));
  };

  const widths = headers.map( header => header.width );

  return (
    <TableRow style={{background: user.enabled ? "normal" : "#efefef"}}>
      <TableRowColumn style={{ width: widths[0] }}>
        {user.enabled ? "有効" : "無効"}
      </TableRowColumn>
      <TableRowColumn style={{ width: widths[1] }}>
        {user.account_name}
      </TableRowColumn>
      <TableRowColumn style={{ width: widths[2] }}>
        {user.name}
      </TableRowColumn>
      {/* <TableRowColumn style={{ width: widths[3] }}> */}
      {/*   {user.email} */}
      {/* </TableRowColumn> */}
      <TableRowColumn style={{ width: widths[3] }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {renderGroups(user.groups)}
        </div>
      </TableRowColumn>
      <TableRowColumn style={{ width: widths[4] }}>
        <IconButton containerElement={<Link to={`/users/${user._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
      <TableRowColumn style={{ width: widths[5] }}>
        <IconButton onClick={() => handleDelete(user)} disabled={loginUserId === user._id}>
          <ImageDelete />
        </IconButton>
      </TableRowColumn>

    </TableRow>
  );
};
UserTableBody.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserTableBody;

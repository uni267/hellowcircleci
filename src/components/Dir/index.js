import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import * as _ from "lodash";

// material
import Checkbox from 'material-ui/Checkbox';
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import TextField from "material-ui/TextField";

// material icons
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import FileFolderOpen from "material-ui/svg-icons/file/folder-open";
import ContentForward from "material-ui/svg-icons/content/forward";
import EditorModeEdit from "material-ui/svg-icons/editor/mode-edit";
import ContentContentCopy from "material-ui/svg-icons/content/content-copy";
import ActionDelete from "material-ui/svg-icons/action/delete";
import ActionVerifiedUser from "material-ui/svg-icons/action/verified-user";
import ActionHistory from "material-ui/svg-icons/action/history";
import DirDialogMenu from "./DirDialogMenu";

// material custom icons
import FileFolderOpen_TS from "../icons/FileFolderOpen_TS";

const style = {
  dir: {
    textDecoration: "none",
    color: "#555"
  },
  dir_icon: {
    padding: 0,
    marginRight: 10
  },
  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  }
};

class Dir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      historiesDir: { open: false }
    };

  }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  renderMember = () => {
    const { authorities } = this.props.dir;
    const firstMemberName = _.get(authorities[0], 'users.name') || _.get(authorities[0], 'groups.name') || 'none'  //super user が実装されると、権限ゼロの時に'none'表示される
    const member = authorities.length > 1
          ? `${authorities.length} 人のメンバー`
          : `${firstMemberName} のみ`;

    return (
      <span
        onClick={() => this.setState({ editAuthority: { open: true } })}>
        {member}
      </span>
    );

  };

  renderDirIcon = iconStyle => {
    const autoTimestamp = this.props.dir.meta_infos.find(m => m.name === "auto_grant_timestamp")
    return (!!autoTimestamp && !!autoTimestamp.value)
      ? <FileFolderOpen_TS style={iconStyle} />
      : <FileFolderOpen style={iconStyle} />
  }

  renderDirName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const linkToDir = () => {
      this.props.history.push(`/home/${this.props.dir._id}`);
    };

    const linkToDirRoute = () => {
      this.props.history.push(`/home/${this.props.dir.dir_route}`);
    };

    const style = {
      ...this.props.cellStyle,
      width: this.props.headers[1].width
    };

    let view;

    if (this.props.dir.dir_route) {
      view = (
        <div style={{ ...style, color }}>
          <div>
            <div
              onClick={linkToDir}
              style={{ display: "flex", alignItems: "center" }}>
              <div>
                {this.renderDirIcon(style.dir_icon)}
              </div>
              <div style={{ marginLeft: 10 }}>
                {this.props.dir.name}
              </div>
            </div>
            <div
              onClick={linkToDirRoute}
              style={{ fontSize: 12, color: "#aaa" }}>
              場所: {this.props.dir.dir_route}
            </div>
          </div>
        </div>
      );
    }
    else {
      view = (
        <div style={{ ...style, color }}
             onClick={linkToDir} >
          <div>
            {this.renderDirIcon(style.dir_icon)}
          </div>
          <div style={{ marginLeft: 10 }}>
            {this.props.dir.name}
          </div>
        </div>
      );
    }

    return view;
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { dir } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const isActive = canDrop && isOver;
    const backgroundColor = isActive || dir.checked
        ? "rgb(232, 232, 232)" : "inherit";

    const favorite_icon = (
      <ActionFavorite />
    );

    const favorite_icon_border = (
      <ActionFavoriteBorder />
    );

    const action_menu_icon = () => {
      const opacity = this.state.hover ? 1 : 0.1;
      return (
        <IconButton style={{ opacity }}>
          <NavigationMenu />
        </IconButton>
      );
    };

    const checkOpacity = this.state.hover || dir.checked ? 1 : 0.1;

    const elements = (
      <div
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        style={{...rowStyle, backgroundColor}}>

        <div style={{...cellStyle, width: headers[0].width}}>
          <Checkbox
            checked={dir.checked}
            style={{...style.checkbox, opacity: checkOpacity}}
            onCheck={() => {
              this.props.actions.setPageYOffset(window.pageYOffset)
              this.props.actions.toggleFileCheck(dir)
            }} />
          <Checkbox
            disabled={true}
            style={style.checkbox}
            checkedIcon={favorite_icon}
            uncheckedIcon={favorite_icon_border} />
        </div>

        {this.renderDirName()}

        <div style={{...cellStyle, width: headers[2].width}}>
          {headers[2].name === "modified"
          ? moment(dir.modified).format("YYYY-MM-DD HH:mm:ss") : null}
        </div>

        <div style={{...cellStyle, width: headers[3].width}}>
          {headers[3].name === "authorities"
          ? this.renderMember() : null}
        </div>

        <div style={{...cellStyle, width: headers[4].width}}>
          <DirDialogMenu
            dir={this.props.dir}
            actions={this.props.actions}
            hover={this.state.hover}
            trashDirId={this.props.tenant.trashDirId} />
        </div>

      </div>
    );

    return canDrop && connectDropTarget
      ? connectDropTarget(elements)
      : elements;
  }
}

Dir.propTypes = {
  history: PropTypes.object.isRequired,
  dir: PropTypes.object.isRequired,
  rowStyle: PropTypes.object.isRequired,
  cellStyle: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default Dir;

import React, { Component } from "react";

// router
import { withRouter } from "react-router-dom";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// components
import AddFilterBtn from "../components/FileSearch/AddFilterBtn";
import SimpleSearch from "../components/FileSearch/SimpleSearch";
import DetailSearch from "../components/FileSearch/DetailSearch";
import AddDownloadBtn from "../components/XlsxDownload/AddDownloadBtn";

import Toggle from 'material-ui/Toggle';

// actions
import * as FileActions from "../actions/files";

import { APP_SETTING } from "../constants";
import appSettingsHelper from '../helper/appSettingsHelper'

// etc
import { find } from "lodash";

const styles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "row-reverse"
  },
  formContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap"
  }
};

class FileSearchContainer extends Component {
  componentWillMount() {
    if(this.props.isSimple){
      this.props.actions.requestFetchFileSearchItems();
    }
    this.props.actions.requestFetchTags();
  }

  unvisibleToggle = () => {
    let element = null;
    const unvisivle_file_toggle = appSettingsHelper.getItem(this.props.appSettings, APP_SETTING.UNVISIBLE_FILES_TOGGLE)
    console.log(unvisivle_file_toggle)
    if (unvisivle_file_toggle) {
      element = unvisivle_file_toggle.enable
          ? (
            <div style={{ ...styles.buttonContainer, marginTop: 20 }}>
              <Toggle
                label="非表示ファイルを表示する"
                toggled={unvisivle_file_toggle.default_value}
                thumbStyle={{ backgroundColor: "#ffcccc" }}
                trackStyle={{ backgroundColor: "#ff9d9d" }}
                style={{ maxWidth: 270 }}
                onToggle={ (event, checked) => {
                  this.props.actions.toggleDisplayUnvisibleFiles(checked);
                }}
                />
            </div>
          )
          : null;
    }
    return element;
  };

  render() {
    const isSimple = this.props.isSimple;

    return (
      <div style={{marginTop: 10, marginRight: 25, marginBottom: 15}}>

        {/* フィルタ追加ボタン */}
        <div style={styles.buttonContainer}>
          <div>
            <AddFilterBtn { ...this.props } />
          </div>

          <div style={{paddingRight: 10}} >
          { appSettingsHelper.getValue(this.props.appSettings, APP_SETTING.EXPORT_EXCEL_FOR_FILELIST) ?
              <AddDownloadBtn { ...this.props } />
              : null
            }
          </div>

        </div>

        {this.unvisibleToggle()}
        <div style={styles.formContainer}>
          {/* 簡易検索 or 詳細検索 */}
          { isSimple
            ? (
              <SimpleSearch
                {...this.props}
                history={this.props.history}
                hintText="ファイル名を入力"
                />
            )
            : <DetailSearch { ...this.props } />
          }
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    tenant: state.tenant,
    searchItems: state.fileDetailSearch.items,
    searchValues: state.fileDetailSearch.searchValues,
    searchedItems: state.fileDetailSearch.searchedItems,
    open: state.fileDetailSearch.open,
    anchorElement: state.fileDetailSearch.anchorElement,
    isSimple: find(state.fileDetailSearch.items,{ picked:true }) === undefined,
    tags: state.tags,
    users: state.users,
    disableDownloadBtnSimple: state.fileSimpleSearch.search_value === undefined,
    disableDownloadBtnDetail: state.fileDetailSearch.searchedItems === undefined,
    fileSimpleSearch: state.fileSimpleSearch,
    appSettings: state.appSettings,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(FileActions, dispatch)
});

FileSearchContainer = connect(
  mapStateToProps, mapDispatchToProps
)(FileSearchContainer);

export default withRouter(FileSearchContainer);

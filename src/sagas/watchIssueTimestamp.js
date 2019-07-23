import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commonActions from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchIssueTimestamp() {
  while (true) {
    const { file } = yield take(actions.issueTimestamp().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      const { data: { body: { meta_info }}} = yield call(api.grantTimestamp, file._id);

      if (meta_info && meta_info.name === "timestamp") {
        let meta_infos
        if (file.meta_infos.filter(m => m.name === "timestamp").length > 0) { //既存のタイムスタンプ情報が存在する場合
          meta_infos = file.meta_infos.map(m => m.name === "timestamp" ? meta_info : m )  //既存情報の差し替え
        }
        else {
          meta_infos = file.meta_infos.length > 0 ? [...file.meta_infos, meta_info] : [meta_info] //今回のタイムスタンプ情報を追加
        }
        const updateFile = {
          ...file, meta_infos
        }
        yield put(commonActions.triggerSnackbar("タイムスタンプを発行しました"))
        yield put(actions.updateFileRow(updateFile))
        yield put(actions.updateTimestampTargetFile(updateFile))
        yield put(actions.toggleTimestampConfirmDialog())
      }
    }
    catch (e) {
      const { message, errors } = errorParser(e,"タイムスタンプの発行に失敗しました");
      if(!errors.unknown){
        yield put(commonActions.openException(message, errors[ Object.keys(errors)[0] ]));
      }else{
        yield put(commonActions.openException(message, errors.unknown ));
      }
    }
    finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchIssueTimestamp;

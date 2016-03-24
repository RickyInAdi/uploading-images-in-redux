function* uploadSaga() {
   yield* takeLatest("DROP_IMAGE", showPlaceholderAndUploadImage);
}

function* showPlaceholderAndUploadImage(action) {
   let showPlaceholderTask = null;

   try {
      yield { type: "START_UPLOADING" };

      showPlaceholderTask = yield fork(showPlaceholder, action.file);

      const postBody = new FormData(action.file);
      const response = yield http.post("/images", postBody);

      yield cancel(showPlaceholderTask);

      if (response.status === 201) {
         const imageUrl = response.headers.get("Location");
         yield { type: "SET_IMAGE", url: imageUrl };
      }
      else {
         console.error("Error: " + response.statusText);
         yield { type: "REMOVE_IMAGE" };
      }

      yield { type: "STOP_UPLOADING" };
   }
   catch (e) {
      if (!isCancelError(e))
         console.error(e.stack);
      yield cancel(showPlaceholderTask);
      yield { type: "CANCEL_UPLOADING" };
   }
}

function* showPlaceholder(file) {
   try {
      yield { type: "REMOVE_IMAGE" };
      const dataUrl = yield readAsDataURL(file);
      yield { type: "SET_IMAGE", url: dataUrl };
   }
   catch (e) {
      if (!isCancelError)
         console.log(e.stack);
   }
}

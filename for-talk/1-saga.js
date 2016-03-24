function* uploadSaga() {
   yield* takeEvery("DROP_IMAGE", uploadImage);
}

function* uploadImage(action) {
   try {
      yield { type: "START_UPLOADING" };

      const dataUrl = yield readAsDataURL(action.file);

      yield { type: "SET_IMAGE", url: dataUrl };

      const postBody = new FormData(action.file);
      const response = yield http.post("/images", postBody);

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
      console.error(e.stack);
      yield { type: "CANCEL_UPLOADING" };
   }
}

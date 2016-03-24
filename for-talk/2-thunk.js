let cancelUpload = null;
function onDropImage(file, dispatch) {
   if (cancelUpload) {
      dispatch({ type: "CANCEL_UPLOADING" });
      cancelUpload();
   }
   cancelUpload = uploadSequence(file, dispatch);
}

function uploadSequence(file, dispatch) {
   let cancelled = false;

   dispatch({ type: "START_UPLOADING" });

   readAsDataURL(file)
      .then(function(dataUrl) {
         if (cancelled)
            return;

         dispatch({ type: "SET_IMAGE", url: dataUrl });

         const postBody = new FormData(file);
         return http.post("/images", postBody);
      })
      .then(function(response) {
         if (cancelled)
            return;

         if (response.status === 201) {
            const imageUrl = response.headers.get("Location");
            dispatch({ type: "SET_IMAGE", url: imageUrl });
         }
         else {
            console.error("Error: " + response.statusText);
            dispatch({ type: "REMOVE_IMAGE" });
         }

         dispatch({ type: "STOP_UPLOADING" });
      })
      .catch(function(e) {
         console.error(e.stack);
         dispatch({ type: "CANCEL_UPLOADING" });
      });

   return function() {
      cancelled = true;
   }
}

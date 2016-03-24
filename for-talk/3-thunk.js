let cancelUpload = null;
let cancelShowPlaceholder = null;
function onDropImage(file, dispatch) {
   if (cancelUpload) {
      dispatch({ type: "CANCEL_UPLOADING" });
      cancelUpload();
      cancelShowPlaceholder();
   }

   cancelShowPlaceholder = showPlaceholderSequence(file, dispatch);
   const { cancel, task } = uploadSequence(file, dispatch);
   cancelUpload = cancel;

   task.then(() => cancelShowPlaceholder());
}

function showPlaceholderSequence(file, dispatch) {
   let cancelled = false;

   dispatch({ type: "REMOVE_IMAGE" });

   readAsDataURL(file)
      .then(function(dataUrl) {
         if (!cancelled)
            dispatch({ type: "SET_IMAGE", url: dataUrl });
      })
      .catch(function(e) {
         console.error(e.stack);
         dispatch({ type: "CANCEL_UPLOADING" });
      });

   return function() { cancelled = true; }
}

function uploadSequence(file, dispatch) {
   let cancelled = false;

   dispatch({ type: "START_UPLOADING" });

   const postBody = new FormData(file);

   const uploadTask = http.post("/images", postBody)
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

   return {
      task: uploadTask,
      cancel: function() { cancelled = true; }
   };
}

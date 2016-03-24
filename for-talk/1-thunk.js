function onDropImage(file, dispatch) {
   dispatch({ type: "START_UPLOADING" });

   readAsDataURL(file)
      .then(function(dataUrl) {
         dispatch({ type: "SET_IMAGE", url: dataUrl });

         const postBody = new FormData(file);
         return http.post("/images", postBody);
      })
      .then(function(response) {
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
}
